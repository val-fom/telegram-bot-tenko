const rp = require('request-promise');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const TENKO_API_URI = process.env.TENKO_API_URI
const TENKO_API_TOKEN = process.env.TENKO_API_TOKEN

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

  if (text === '/total_state') {
    let message = '';
    try {
      const result = await getTotalState();
      console.log('result: ', result);
      message = JSON.stringify(result, null, 2);
      console.log('message: ', message);
    } catch (error) {
      message = `Input: ${text}, \nError: ${error.message}`;
    }

    await sendToUser(chat.id, message);
  } else {
    await sendToUser(chat.id, 'Unknown command');
  }

  return { statusCode: 200 };
};
