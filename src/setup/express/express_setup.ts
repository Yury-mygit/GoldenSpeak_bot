// expressSetup.ts

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { webhookCallback } from 'grammy';

export function setupExpress(app:any, bot:any, botToken:string, localPort:string) {
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: ['*','http://localhost:3002', 'http://localhost:3000', 'https://ebbc-176-115-195-132.ngrok-free.app/']
    }));

    // Define a route that handles your bot updates
    app.post(`/bot${botToken}`, webhookCallback(bot, 'express'));

    // Start the express server
    app.listen(localPort, () => {
        console.log(`Server is running on port ${localPort}`);
        // Check if the webhook needs to be set or updated
        // checkAndSetWebhook(); // Uncomment if you have this function defined elsewhere
    });
}