import {Bot, InlineKeyboard, GrammyError, HttpError, Keyboard, session, SessionFlavor, Context} from 'grammy';
import { LabeledPrice } from 'typegram/payment';
import { config } from 'dotenv';
import {terms, about, paymentOptions, userCommands} from "./desc";
import express from 'express';
import { webhookCallback } from 'grammy';


import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
const cookieParser = require('cookie-parser')

config(); // Load environment variables from .env file
import user_routers from './user/router/user_routers';


const localPort = process.env.PORT!; // The local port you are forwarding with ngrok
const webhookUrl = process.env.WEBHOOKURL!;
const botToken = process.env.BOT_TOKEN!
const botProviderToken = process.env.PROVIDER_TOKEN!

export const bot = new Bot<MyContext>(botToken!);


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3002','http://localhost:3000','https://ebbc-176-115-195-132.ngrok-free.app/']
}));
// Define a route that handles your bot updates
app.post(`/bot${botToken}`, webhookCallback(bot, 'express'));

// Start the express server
app.listen(localPort, () => {
    console.log(`Server is running on port ${localPort}`);
    // Check if the webhook needs to be set or updated
    // checkAndSetWebhook();
});


app.use('/user', user_routers);


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [
            {
                url: 'http://localhost:4001`',
            },
        ],
        tags: [
            { name: 'user' },

        ],
    },
    apis: [
        './src/routes/*.ts',
        './src/user/router/user_routers.ts'
    ], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// webhook ==========================================================

//
// async function checkAndSetWebhook() {
//     try {
//         const currentWebhookInfo = await bot.api.getWebhookInfo();
//         if (currentWebhookInfo.url !== `${webhookUrl}/bot${botToken}`) {
//             console.log('Setting webhook...');
//             await bot.api.setWebhook(`${webhookUrl}/bot${botToken}`);
//             console.log('Webhook set successfully');
//         } else {
//             console.log('Webhook is already set to the correct URL.');
//         }
//     } catch (error) {
//         handleWebhookError(error);
//     }
// }
//
// function handleWebhookError(error:any) {
//     if (error instanceof GrammyError && error.error_code === 429) {
//         const retryAfter = error.parameters?.retry_after;
//         if (typeof retryAfter === 'number') {
//             console.log(`Retrying to set webhook after ${retryAfter} seconds`);
//             setTimeout(checkAndSetWebhook, retryAfter * 1000);
//         } else {
//             console.error('Failed to set webhook due to rate limiting, but no retry_after provided.');
//         }
//     } else {
//         console.error('Failed to set webhook:', error);
//     }
// }

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




// bot.api.setWebhook(`${webhookUrl}/bot${process.env.BOT_TOKEN}`);
bot.api.setMyCommands(userCommands); // Default to user commands


bot.api.setChatMenuButton({
    menu_button: {
        type: 'commands' // Set the menu button to display commands
    }
});

interface MySession {
    step: 'idle' | 'awaiting_label' | 'awaiting_amount';
    editIndex: number | null;
}

type MyContext = Context & SessionFlavor<MySession>;



//


bot.command('start', async (ctx) => {
    if (!ctx.from || !ctx.chat) return;

    let inlineKeyboard = new InlineKeyboard()
        // .webApp('Перети на сайт', 'https://goldenspeak.ru/')
        .text('Оплатить ✅', 'payCall').row()
        .text('О нас', "aboutCall") // Add 'About' button
        .text('Правила использования', "termsCall"); // Add 'Terms of Use' button

    await ctx.reply('Для оплаты занятий нажмите, пожалуйста, "Оплатить ✅"', {
        reply_markup: inlineKeyboard,
    });
});

bot.command('pay', async (ctx) => {
    // Fetch payment options from the server or use default
    // await fetchPaymentOptions();

    const paymentKeyboard = new InlineKeyboard();
    paymentOptions.forEach((option, index) => {
        paymentKeyboard.text(`▫${option.label} - ${option.amount / 100} руб.`, `pay_${index}`).row();
    });

    await ctx.reply('Выберите, пожалуйста, количество занятий:', {
        reply_markup: paymentKeyboard,
    });
});

bot.command('about', async (ctx)=>{
    // await ctx.answerCallbackQuery(); // Acknowledge the callback query
    await ctx.reply(about); // Replace with actual information
})

bot.command('terms', async (ctx)=>{
    // await ctx.answerCallbackQuery(); // Acknowledge the callback query
    await ctx.reply(terms); // Replace with actual information
})




bot.callbackQuery('payCall', async (ctx) => {
    // Acknowledge the callback query to stop the 'pay' button from blinking
    await ctx.answerCallbackQuery();

    const paymentKeyboard = new InlineKeyboard();
    paymentOptions.forEach((option, index) => {
        paymentKeyboard.text(`▫${option.label} - ${option.amount/100 } руб.`, `pay_${index}`).row();
    });

    await ctx.reply('Выберите, пожалуйста, количество занятий:', {
        reply_markup: paymentKeyboard,
    });
});

bot.callbackQuery('aboutCall', async (ctx) => {
    console.log('callbackQuery')
    await ctx.answerCallbackQuery(); // Acknowledge the callback query
    await ctx.reply(about); // Replace with actual information
});

bot.callbackQuery('termsCall', async (ctx) => {
    await ctx.answerCallbackQuery(); // Acknowledge the callback query
    await ctx.reply(terms); // Replace with actual terms of use
});





// Handle callback queries for payment options
bot.callbackQuery(/^pay_\d+$/, async (ctx) => {
    const optionIndex = parseInt(ctx.callbackQuery.data.split('_')[1]);
    const selectedOption = paymentOptions[optionIndex];

    const prices: LabeledPrice[] = [
        { label: selectedOption.label , amount: selectedOption.amount },
    ];

    await ctx.answerCallbackQuery(); // Acknowledge the callback query

    console.log(optionIndex)

    await ctx.replyWithInvoice(
        'Оплата', // title
        `Оплата ${optionIndex==0?"занятия":"занятий"}`, // description
        'Custom-Payload', // payload
        botProviderToken, // provider_token
        'RUB', // currency
        prices // prices
        // Add other optional parameters if needed
    );
});




// Handle graceful shutdown
function handleShutdown(signal: string) {
    console.log(`Received ${signal}. Bot is stopping...`);
    bot.stop()
        .then(() => console.log('Bot has been stopped.'))
        .catch((err) => console.error('Error stopping the bot:', err));
}


bot.on('pre_checkout_query', async (ctx) => {
    // Perform validation checks here
    const isEverythingOk = true; // Replace with actual validation logic

    if (isEverythingOk) {
        await ctx.answerPreCheckoutQuery(true); // Confirm the checkout
    } else {
        await ctx.answerPreCheckoutQuery(false, "An error message explaining the issue");
    }
});

bot.on('message:successful_payment', async (ctx) => {
    // Payment was successful
    const paymentInfo = ctx.message.successful_payment;
    console.log('Payment received:', paymentInfo);

    // You can now deliver the service or product and send a confirmation message to the user
    await ctx.reply('Thank you for your purchase!');

    // Send the payment details to the user with ID 733685428
    const adminId = 733685428; // Telegram user ID of the person to notify
    const paymentDetails = `Payment received from ${ctx.from?.first_name} ${ctx.from?.last_name} (@${ctx.from?.username}):\nTotal amount: ${paymentInfo.total_amount / 100} ${paymentInfo.currency}\nInvoice payload: ${paymentInfo.invoice_payload}`;

    await ctx.api.sendMessage(adminId, paymentDetails);
});

// Catch and log bot errors
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});


bot.start(); // for polling uncomment