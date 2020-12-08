### Simple telegram bot for Tenko boiler api

_inspired by article [Building Your First Serverless Telegram Bot with AWS Lambda](https://iamondemand.com/blog/building-your-first-serverless-telegram-bot/)_

1. clone the project
2. install dependencies `npm i`
3. `npm install -g serverless`
4. setup AWS creds profile
5. create bot via `@BotFather`
6. create .env file with following vars:
   - `TELEGRAM_TOKEN=<bot token provided by @BotFather>`
   - `TENKO_API_URI=<uri to tenko api>`
   - `TENKO_API_TOKEN=<authorization token form />api/v1/auth method>`
   - `USER_NAME=<your telegram user name>` - in case you want your bot chat with you only
7. deploy the bot `serverless deploy`
8. copy endpoint from the output `https://***************.execute-api.eu-central-1.amazonaws.com/dev/tenko-bot`
9. set the webhook `curl --request POST --url https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook --header 'content-type: application/json' --data '{"url": "<LINK_YOU_GET_FROM_SERVERLESS_DEPLOY>"}'`

### current bot's functionality

`/total_state` - returns total boiler's state

### additional functionality

The schedule was set to run function `totalStat` every day at 0, 7 and 23 hours.
Which sends the stat via the bot and invokes another function `writeStat` whish put these data into the Table in DynamoDb

It requires additional setup of permissions and dynamoDb which you should do by hands

### TODOs

see issues
