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


Запуск в контейнере на локальной машине
```bash
 docker build -t bot .
```

```bash
docker run -d --name bot `
-e BOT_TOKEN=6800763288:AAHkcdO1eU0D8BOt3i6rD025fXwQc5V3e40 `
-e PROVIDER_TOKEN=5707748563:LIVE:547060 `
-e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app `
-e PORT=4001 `
-p 4001:4001 bot 
``````bash

docker run -d --name bot `
-e BOT_TOKEN=6800763288:AAHkcdO1eU0D8BOt3i6rD025fXwQc5V3e40 `
-e PROVIDER_TOKEN=5334985814:TEST:551862 `
-e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app `
-e PORT=4001 `
-p 4001:4001 bot 
```

```bash
docker run -d --name bot -e BOT_TOKEN=6800763288:AAHkcdO1eU0D8BOt3i6rD025fXwQc5V3e40 -e PROVIDER_TOKEN=5707748563:LIVE:547060 -e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app -e PORT=4001 -p 4001:4001 bot 
```

Нужен git и докер
качаю репозиторий, перехожу в staging

запускаю npm i

```bash
git clone git@github.com:Yury-mygit/bot_prod.git
```
git fetch origin staging

git checkout -b staging origin/staging

```bash
 docker build -t logoped_sokolniki_bot .
```

Here is the token for bot Golden Speak bot @Logoped_Sokolniki_bot:
```bash
docker run -d --name logoped_sokolniki_bot -e BOT_TOKEN=6800763288:AAHkcdO1eU0D8BOt3i6rD025fXwQc5V3e40 -e PROVIDER_TOKEN=5334985814:TEST:551862 -e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app -e PORT=4001 -p 4001:4001 logoped_sokolniki_bot 
```

dev_bot_1
```bash
docker run -d --name bot -e BOT_TOKEN=6713439573:AAHb1uPAUKTOC9ZOhBVl93Lrn0EY1JYafN8 -e PROVIDER_TOKEN=5334985814:TEST:551862 -e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app -e PORT=4001 -p 4001:4001 bot 
```


Here !!!is the token for bot Golden Speak bot @Logoped_Sokolniki_bot:
```bash
docker run -d --name gs -e BOT_TOKEN=6428830020:AAE_9g6ccwzx6I3qob3cOMwK_D2XyuHytqU -e PROVIDER_TOKEN=5707748563:LIVE:547060 -e WEBHOOKURL=https://04bd-176-115-195-132.ngrok-free.app -e PORT=4000 -p 4000:4000 logoped_sokolniki_bot 
```


запуск через на локальной машне
npm start





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

ssh -i  D:\.ssh ssh root@213.171.8.160


npm i --save-dev @types/express

o ensure cross-platform compatibility, use shx for file operations. First, install shx if you haven't already:
```bash
npm install --save-dev shx
```

"scripts": {
"build": "tsc && npm run copy-assets",
"copy-assets": "shx cp package.json dist/ && shx cp Dockerfile dist/"
}


## Docker + Nginx + Certbot

Plan for running Certbot with Nginx in Docker:
-Pull the official Certbot Docker image.
-Create a Docker network for Certbot and Nginx to communicate.
-Run an Nginx container connected to the created network.
-Run the Certbot container on the same network to generate/renew SSL certificates.
-Configure Nginx to use the obtained certificates.
-Set up a volume for persistent storage of certificates.

### Step 1: Pull Certbot Docker image
docker pull certbot/certbot

### Step 2: Create Docker network
docker network create certbot_network

### Step 3: Run Nginx container
docker run --name nginx-container --network certbot_network -v /path/to/nginx/conf:/etc/nginx/conf.d -v /path/to/webroot:/var/www/html -p 80:80 -p 443:443 -d nginx

### Step 4: Run Certbot container
```bash
docker run --name certbot --network certbot_network -v /path/to/certificates:/etc/letsencrypt -v /path/to/webroot:/var/www/html --rm certbot/certbot certonly --webroot --webroot-path=/var/www/html --email your-email@example.com --agree-tos --no-eff-email -d example.com -d www.example.com
```
Note: Replace "/path/to/nginx/conf", "/path/to/webroot", "/path/to/certificates", "your-email@example.com", "example.com", and "www.example.com" with your actual paths, email, and domain names.

### Step 5: Configure Nginx to use SSL certificates
### Edit the Nginx configuration file to point to the SSL certificates in /path/to/certificates

### Step 6: Set up a volume for persistent storage
### The volumes in steps 3 and 4 are already mapped for persistence.

Now, the actual commands:

# Pull the Certbot Docker image
docker pull certbot/certbot

# Create a Docker network
docker network create certbot_network

# Run Nginx container
docker run --name nginx-container \
--network certbot_network \
-v /path/to/nginx/conf:/etc/nginx/conf.d \
-v /path/to/webroot:/var/www/html \
-p 80:80 -p 443:443 \
-d nginx

# Run Certbot container
docker run --name certbot \
--network certbot_network \
-v /path/to/certificates:/etc/letsencrypt \
-v /path/to/webroot:/var/www/html \
--rm certbot/certbot certonly \
--webroot --webroot-path=/var/www/html \
--email your-email@example.com \
--agree-tos --no-eff-email \
-d example.com -d www.example.com

docker-compose up -d