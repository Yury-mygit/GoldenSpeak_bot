import {Bot, InlineKeyboard, GrammyError, HttpError, Keyboard, session, SessionFlavor, Context} from 'grammy';
import { LabeledPrice } from 'typegram/payment';
import { config } from 'dotenv';
import {terms, about, paymentOptions, userCommands} from "./desc";
import express from 'express';
import { webhookCallback } from 'grammy';
import axios from 'axios';
import { setupSwagger } from './setup/swagger/swagger_setup';
import { setupExpress } from './setup/express/express_setup';
import AppealController from "./Controllers/BorAction/Appeal_controller"
import MKeyboard from './keyboard/Index'

config(); // Load environment variables from .env file
import user_routers from './user/router/user_routers';

const mode = process.env.MODE || 'POLLING';
const localPort = process.env.PORT || '4000';
const webhookUrl = process.env.WEBHOOKURL || '';
const botToken = process.env.BOT_TOKEN!;
const botProviderToken = process.env.PROVIDER_TOKEN!;

if (mode === 'WEBHOOK' && !webhookUrl) {
    console.error('WEBHOOKURL is required when MODE is set to "WEBHOOK"');
    process.exit(1);
}

// Define the shape of your session data
interface SessionData {
    appealState: 'awaiting_input' | 'received_input' | null;
}

// Add the session flavor to the context type
type MyContext = Context & SessionFlavor<SessionData>;



export const bot = new Bot<MyContext>(botToken!);
const app = express();

setupExpress(app, bot, botToken, localPort);
app.use('/user', user_routers);

bot.use(session({
    initial: (): SessionData => ({ appealState: null }),
}));

const adminIds= [565047052]
setupSwagger(app);

bot.api.setMyCommands(userCommands); // Default to user commands

bot.command('start', async (ctx) => {
    if (!ctx.from || !ctx.chat) return;
    await ctx.reply('Для оплаты занятий нажмите, пожалуйста, "Оплатить ✅"', {
        reply_markup: MKeyboard.main,
    });
});

async function handleAppeal(ctx: Context) {
    await ctx.answerCallbackQuery();
    await ctx.reply('Please send the text of your appeal along with any photo or video.');
}

bot.on('message', async (ctx, next) => {
    if (ctx.session.appealState === 'awaiting_input' && (ctx.message.text || ctx.message.photo || ctx.message.video)) {
        for (const adminId of adminIds) {
            await ctx.forwardMessage(adminId);
        }
        ctx.session.appealState = 'received_input';
        await ctx.reply('Thank you for your appeal. What would you like to do next?', {
            reply_markup: MKeyboard.main,
        });
        await next();
    }
    await next();
});

// Attach the handleAppeal function to both the callbackQuery and command for "appeal"

bot.callbackQuery('appeal', async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.appealState = 'awaiting_input';
    await ctx.reply('Please send the text of your appeal along with any photo or video.');
});
bot.command('appeal', async (ctx) => {
    ctx.session.appealState = 'awaiting_input';
    await ctx.reply('Please send the text of your appeal along with any photo or video.');
});
bot.command('about', async (ctx)=>{
    await ctx.reply(about); // Replace with actual information
})




bot.command('terms', async (ctx)=>{
    await ctx.reply(terms); // Replace with actual information
})




bot.callbackQuery('payCall', async (ctx) => {
    await ctx.answerCallbackQuery();
    const paymentKeyboard = new InlineKeyboard();
    paymentOptions.forEach((option, index) => {
        paymentKeyboard.text(`▫${option.label} - ${option.amount/100 } руб.`, `pay_${index}`).row();
    });

    await ctx.reply('Выберите, пожалуйста, количество занятий:', {
        reply_markup: paymentKeyboard,
    });
});

bot.command('pay', async (ctx) => {
    const paymentKeyboard = new InlineKeyboard();
    paymentOptions.forEach((option, index) => {
        paymentKeyboard.text(`▫${option.label} - ${option.amount / 100} руб.`, `pay_${index}`).row();
    });

    await ctx.reply('Выберите, пожалуйста, количество занятий:', {
        reply_markup: paymentKeyboard,
    });
});

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
        'Custom-Payload!!!!', // payload
        botProviderToken, // provider_token
        'RUB', // currency
        prices // prices
        // Add other optional parameters if needed
    );
});

bot.on('pre_checkout_query', async (ctx) => {
    // Perform validation checks here
    const isEverythingOk = true; // Replace with actual validation logic

    if (isEverythingOk) {
        await ctx.answerPreCheckoutQuery(true); // Confirm the checkout
    } else {
        await ctx.answerPreCheckoutQuery(false, "An error message explaining the issue");
    }
});

bot.on('message', async (ctx) => {
    // console.log('ctx.messag', ctx.message)
    if ('successful_payment' in ctx.message) {
        const paymentInfo = ctx.message.successful_payment;

        if (!paymentInfo) throw new Error("Info is undefined")

        console.log('Payment received:', paymentInfo);
        console.log('paymentInfo.invoice_payload:', paymentInfo.invoice_payload);
        await ctx.reply('Thank you for your purchase!');
        const adminId = 733685428;
        const paymentDetails = `Payment received from ${ctx.from?.first_name} ${ctx.from?.last_name} (@${ctx.from?.username}):\nTotal amount: ${paymentInfo.total_amount / 100} ${paymentInfo.currency}\nInvoice payload: ${paymentInfo.invoice_payload}`;
        await ctx.api.sendMessage(adminId, paymentDetails);


        // Define the URL and the payload for the POST request
        const url = 'http://localhost:3002/payment/create';
        const payload = {
            // user_id: ctx.from?.id,
            telegram_id: ctx.from?.id, // Assuming you want to use the Telegram user ID
            // product_id: paymentInfo.invoice_payload // Assuming the invoice_payload contains the product_id
            product_id: 2 // Assuming the invoice_payload contains the product_id
        };

        // console.log('payload', payload)
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                }
            });
            console.log('POST request result:', response.data);
        } catch (error:any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            console.error('Error config:', error.config);
        }
    }
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

interface Pay {
    product_desc: string;
    pay_id: number;
    user_id: number;
    status: string;
    spend: number;
    created: string;
}





bot.callbackQuery('payment_history', async (ctx) => {
    const telegramID = ctx.from.id;

    try {
        // Send a POST request to the payment service
        const response = await axios.post('http://localhost:3002/payment/get_by_telegram_id', {
            telegram_id: telegramID
        });

        // console.log(response.data)
        // {
        //     pay_id: 25,
        //     user_id: 2,
        //     user_name: 'Gabe',
        //     product_name: 'subscription_4',
        //     product_desc: 'Разовое занятие',
        //     status: 'new',
        //     spend: 0,
        //     created: '2023-12-16T21:22:43.247Z'
        // },


        const pays: Pay[] = response.data; // Use the Pay interface here
        let message = `${ctx.from.first_name}, ваши платежи:\n`;

        pays.reverse().forEach((pay: Pay) => { // Annotate pay with the Pay type
            message += `Абонемент: ${pay.product_desc}, Status: ${pay.status}, Spend: ${pay.spend}\n`;
            let date = new Date(pay.created)
            console.log(  date.getDate()  )
        });

        // Send the formatted message to the user
        await ctx.reply(message);
    } catch (error) {
        console.error('Error fetching payments:', error);
        await ctx.reply('An error occurred while fetching your payments.');
    }

    await ctx.answerCallbackQuery(); // Acknowledge the callback query
});
// Handle callback queries for payment options




// Handle graceful shutdown
function handleShutdown(signal: string) {
    console.log(`Received ${signal}. Bot is stopping...`);
    bot.stop()
        .then(() => console.log('Bot has been stopped.'))
        .catch((err) => console.error('Error stopping the bot:', err));
}




// curl -X 'POST' \
//   'http://localhost:3002/payment/create' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "user_id": 2,
//     "telegram_id": 565047052,
//     "product_id": 2
// }'


// MIR: 2200000000000004, 2200000000000012, 2200000000000020
// VISA: 4256000000000003, 4256000000000011, 4256000000000029
// MASTERCARD: 5236000000000005, 5236000000000013, 5236000000000021
// UNION_PAY: 6056000000000000, 6056000000000018, 6056000000000026











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

async function checkAndSetWebhook() {
    try {
        const currentWebhookInfo = await bot.api.getWebhookInfo();
        if (currentWebhookInfo.url !== `${webhookUrl}/bot${botToken}`) {
            console.log('Setting webhook...');
            await bot.api.setWebhook(`${webhookUrl}/bot${botToken}`);
            console.log('Webhook set successfully');
        } else {
            console.log('Webhook is already set to the correct URL.');
        }
    } catch (error) {
        handleWebhookError(error);
    }
}
function handleWebhookError(error:any) {
    if (error instanceof GrammyError && error.error_code === 429) {
        const retryAfter = error.parameters?.retry_after;
        if (typeof retryAfter === 'number') {
            console.log(`Retrying to set webhook after ${retryAfter} seconds`);
            setTimeout(checkAndSetWebhook, retryAfter * 1000);
        } else {
            console.error('Failed to set webhook due to rate limiting, but no retry_after provided.');
        }
    } else {
        console.error('Failed to set webhook:', error);
    }
}

if (mode==='WEBHOOK'){
    console.log("WEBHOOK on")

    checkAndSetWebhook()


} else {
    bot.start()
    console.log("Polling is running")
}