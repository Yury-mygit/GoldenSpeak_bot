import {Bot, InlineKeyboard, GrammyError, HttpError, Keyboard} from 'grammy';
import { LabeledPrice } from 'typegram/payment';
import { InlineQueryResultArticle } from 'typegram/inline';
import { config } from 'dotenv';
import { InlineQueryResult } from 'typegram';

config(); // Load environment variables from .env file

const bot = new Bot(process.env.BOT_TOKEN!); // Exclamation mark for non-null assertion

bot.command('start', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .webApp('Sign Up', 'https://goldenspeak.ru/')
        .switchInlineCurrent('shop11')// Web App URL

    await ctx.reply('Welcome to the Speech Therapy Center Bot! Choose an option:', {
        reply_markup: inlineKeyboard,
    });
});


const paymentOptions = [
    { label: 'Option 1', amount: 1000 }, // Amount in the smallest units of currency (e.g., cents)
    { label: 'Option 2', amount: 2000 },
    { label: 'Option 3', amount: 30000 },
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



const products = [
    { id: '1', title: 'Product 1', description: 'Description 1', amount: 1000 },
    { id: '2', title: 'Product 2', description: 'Description 2', amount: 2000 },
    { id: '3', title: 'Product 3', description: 'Description 3', amount: 3000 },
];

// Handle inline queries to show product cards
bot.on('inline_query', async (ctx) => {
    const results: InlineQueryResultArticle[] = products.map((product) => ({
        type: 'article',
        id: product.id,
        title: product.title,
        input_message_content: {
            message_text: `${product.title} - ${product.description}\nPrice: $${(product.amount / 100).toFixed(2)}`
        },
        description: product.description,
        reply_markup: new InlineKeyboard().text('Pay', `pay_${product.id}`) // Use text button with callback data
    }));

    await ctx.answerInlineQuery(results);
});


// Handle chosen inline result to initiate payment
bot.callbackQuery(/^pay_\d+$/, async (ctx) => {
    const productId = ctx.callbackQuery.data.split('_')[1];
    const selectedProduct = products.find(product => product.id === productId);

    if (selectedProduct) {
        const prices: LabeledPrice[] = [
            { label: selectedProduct.title, amount: selectedProduct.amount }
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
    }
});




// Handle graceful shutdown
// function handleShutdown(signal: string) {
//     console.log(`Received ${signal}. Bot is stopping...`);
//     bot.stop()
//         .then(() => console.log('Bot has been stopped.'))
//         .catch((err) => console.error('Error stopping the bot:', err));
// }


// bot.on('pre_checkout_query', async (ctx) => {
//     // Perform validation checks here
//     const isEverythingOk = true; // Replace with actual validation logic
//
//     if (isEverythingOk) {
//         await ctx.answerPreCheckoutQuery(true); // Confirm the checkout
//     } else {
//         await ctx.answerPreCheckoutQuery(false, "An error message explaining the issue");
//     }
// });

// bot.on('message:successful_payment', async (ctx) => {
//     // Payment was successful
//     const paymentInfo = ctx.message.successful_payment;
//     console.log('Payment received:', paymentInfo);
//
//     // You can now deliver the service or product and send a confirmation message to the user
//     await ctx.reply('Thank you for your purchase!');
// });
//
// // Catch and log bot errors
// bot.catch((err) => {
//     const ctx = err.ctx;
//     console.error(`Error while handling update ${ctx.update.update_id}:`);
//     const e = err.error;
//     if (e instanceof GrammyError) {
//         console.error("Error in request:", e.description);
//     } else if (e instanceof HttpError) {
//         console.error("Could not contact Telegram:", e);
//     } else {
//         console.error("Unknown error:", e);
//     }
// });

// Start the bot and log a message
bot.start()


