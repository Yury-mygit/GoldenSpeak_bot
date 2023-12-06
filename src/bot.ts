import {Bot, InlineKeyboard, GrammyError, HttpError, Keyboard} from 'grammy';
import { LabeledPrice } from 'typegram/payment';
import { InlineQueryResultArticle } from 'typegram/inline';
import { config } from 'dotenv';
import { InlineQueryResult } from 'typegram';

config(); // Load environment variables from .env file

const bot = new Bot(process.env.BOT_TOKEN!); // Exclamation mark for non-null assertion

bot.command('start', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .webApp('Sign Up', 'https://goldenspeak.ru/') // Web App URL

    await ctx.reply('Welcome to the Speech Therapy Center Bot! Choose an option:', {
        reply_markup: inlineKeyboard,
    });
});


const paymentOptions = [
    { label: 'Option 1', amount: 1000 }, // Amount in the smallest units of currency (e.g., cents)
    { label: 'Option 2', amount: 2000 },
    { label: 'Option 3', amount: 3000 },
];

// Add command to send payment options
bot.command('pay', async (ctx) => {
    const paymentKeyboard = new InlineKeyboard();
    paymentOptions.forEach((option, index) => {
        paymentKeyboard.text(option.label, `pay_${index}`);
    });

    await ctx.reply('Choose a payment option:', {
        reply_markup: paymentKeyboard,
    });
});

// Handle callback queries for payment options
bot.callbackQuery(/^pay_\d+$/, async (ctx) => {
    const optionIndex = parseInt(ctx.callbackQuery.data.split('_')[1]);
    const selectedOption = paymentOptions[optionIndex];

    const prices: LabeledPrice[] = [
        { label: selectedOption.label, amount: selectedOption.amount },
    ];

    await ctx.answerCallbackQuery(); // Acknowledge the callback query

    await ctx.replyWithInvoice(
        'Payment', // title
        'Your selected payment option', // description
        'Custom-Payload', // payload
        process.env.PROVIDER_TOKEN!, // provider_token
        'USD', // currency
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

// Start the bot and log a message
bot.start()
    .then(() => console.log('Bot is up and running.'))
    .catch((err) => console.error('Error starting the bot:', err));

