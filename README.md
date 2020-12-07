### Simple telegram bot using serverless framework

_inspired by article [Building Your First Serverless Telegram Bot with AWS Lambda](https://iamondemand.com/blog/building-your-first-serverless-telegram-bot/)_

1. clone the project
2. install dependencies `npm i`
3. `npm install -g serverless`
4. setup AWS creds profile
5. create bot via `@BotFather`
6. create .env file with `TELEGRAM_TOKEN=<bot token provided by @BotFather>`
7. deploy the bot `serverless deploy`
8. copy endpoint from the output `https://***************.execute-api.eu-central-1.amazonaws.com/dev/short-bot`
9. set the webhook `curl --request POST --url https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook --header 'content-type: application/json' --data '{"url": "<LINK_YOU_GET_FROM_SERVERLESS_DEPLOY>"}'`

### current functionality

The bot shortens the URL which user sends
