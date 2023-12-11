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




Compile TypeScript to JavaScript: Use the TypeScript compiler (tsc) to compile your TS files into JS as described in the previous steps.
Create a Dockerfile: In the root of your project, create a file named Dockerfile with the following content:


# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the compiled JavaScript code and any other necessary files into the container
COPY . .

# Your app binds to port 4000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 4000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "dist/index.js" ]

Make sure to replace dist/index.js with the path to your compiled JS entry point file.
Build the Docker Image: Run the following command to build the Docker image:


docker build -t your-bot-name .



Replace your-bot-name with a name for your Docker image.
Run the Docker Container: Once the image is built, you can run it as a container:

docker run -p 4000:4000 your-bot-name


This command maps port 4000 of the container to port 4000 on the host machine.
Transfer the Docker Image: To transfer the Docker image to another server, you can:
Push the image to a Docker registry (like Docker Hub) and then pull it from the server.
Save the Docker image to a tar file, transfer it using SCP or similar tools, and then load it on the server.
Here's how to save the image to a tar file:

docker save -o <path for generated tar file> <image name>

And to load the image on the server:
docker load -i <path to image tar file>

Run the Container on the Server: After transferring the image to the server, use the docker run command as before to start the container.
Remember to handle environment variables and any required configurations for production deployment within your Docker setup.


q5yGSWz7n_N7C^




```bash
docker build -t gs_bot .
```


docker run  -d --name gs_bot `
-v ${PWD}:/code `
-v ${PWD}/requirements.txt:/code/requirements.txt `
-e BOT_TOKEN=6428830020:AAG_FWTT5DuTMUAn7TNulpMcnevTyG3nS14 `
-e PROVIDER_TOKEN=5707748563:LIVE:547060`
-e DB_PASSWORD=321 -e DB_HOST=db_postgres `
--expose 4000 gs_bot