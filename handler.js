const rp = require('request-promise');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const TENKO_API_URI = process.env.TENKO_API_URI
const TENKO_API_TOKEN = process.env.TENKO_API_TOKEN
const USER_NAME = process.env.USER_NAME

async function getTotalState() {
  const options = {
    method: 'GET',
    uri: `${TENKO_API_URI}/total_state`,
    headers: {
      "accept": "application/json",
      "authorization": `Bearer ${TENKO_API_TOKEN}`
    },
    json: true,
  };

  return rp(options);
}

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };

  return rp(options);
}

module.exports.tenkobot = async event => {
  const body = JSON.parse(event.body);
  const {chat, text} = body.message || body.edited_message;

  if (USER_NAME && chat.username !== USER_NAME) {
    await sendToUser(chat.id, 'This is a private bot');
    console.warn(`User @${chat.username} tried to chat with me`);
    return { statusCode: 200 };
  }

  if (text === '/total_state') {
    let message = '';
    try {
      const result = await getTotalState();
      message = JSON.stringify(result, null, 2);
    } catch (error) {
      message = `Input: ${text}, \nError: ${error.message}`;
    }

    await sendToUser(chat.id, message);
  } else {
    await sendToUser(chat.id, 'Unknown command');
  }

  return { statusCode: 200 };
};

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region: 'eu-central-1'});

// TODO: refactor: move to separate file
module.exports.totalStat = async event => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  let message = '';
  try {
    const result = await getTotalState();
    message = JSON.stringify(result, null, 2);
    lambda.invoke({
      FunctionName: "telegram-bot-tenko-dev-writeStat", 
      Payload: JSON.stringify({
        body: result,
      }), 
    }).promise();
  } catch (error) {
    message = `Error: ${error.message}`;
  }

  await sendToUser('274830547', message);

  return { statusCode: 200 };
};

// TODO: refactor: move to separate file
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

module.exports.writeStat = async (event, context, callback) => {
  const requestId = context.awsRequestId;
  const {BDT} = event.body;
  const date = getDate(BDT);

  try {
    await createStatRecord(requestId, date, JSON.stringify(event.body))
    callback(null, {
      statusCode: 201,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('error: ', error);
    callback({
      statusCode: 500,
      body: error,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
};

/**
 * 
 * @param {string} id 
 * @param {number} date 
 * @param {string} data 
 */

function createStatRecord(id, date, data) {
  const params = {
    TableName: 'TenkoStat',
    Item: {
      id,
      date,
      data,
    },
  };

  return ddb.put(params).promise();
}

function getDate({h, m, dd, mm, yy }) {
  const date = new Date(`${mm} ${dd} ${yy} ${h}:${m} GMT+0200`);
  return Number(date);
}

