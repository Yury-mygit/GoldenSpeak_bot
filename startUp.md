To create a Telegram bot using grammy with TypeScript and enable automatic restart in development mode, follow these steps:
Set up the project:
Initialize a new npm project.
Install necessary packages (grammy, typescript, ts-node, nodemon).
Set up TypeScript configuration.
Create a .env file for environment variables.
Develop the bot:
Write the bot's code using grammy.
Implement registration, payment, and contact features.
Use middleware for session management and handling commands.
Development workflow:
Configure nodemon to watch for file changes and restart the bot.








Initialize npm project and install dependencies:


npm init -y
npm install grammy typescript ts-node nodemon dotenv
npx tsc --init



Configure TypeScript (tsconfig.json):

{
"compilerOptions": {
"target": "ES6",
"module": "commonjs",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true,
"outDir": "./dist"
}
}



Create .env file:
BOT_TOKEN=your_telegram_bot_token

Write main bot script (bot.ts):
import { Bot } from 'grammy';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const bot = new Bot(process.env.BOT_TOKEN!); // Exclamation mark for non-null assertion

// Define commands and logic for registration, payment, and contact

bot.start((ctx) => ctx.reply('Welcome to the Speech Therapy Center Bot!'));

// ... additional bot setup ...

bot.start();



Configure nodemon for development (nodemon.json):
{
"watch": ["src/"],
"ext": "ts",
"ignore": ["src/**/*.spec.ts"],
"exec": "ts-node ./src/bot.ts"
}

Add start script to package.json:
"scripts": {
"start": "nodemon"
}

Now, you can run your bot in development mode with automatic restarts by executing npm start.









