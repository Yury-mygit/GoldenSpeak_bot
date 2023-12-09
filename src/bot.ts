import {Bot, InlineKeyboard, GrammyError, HttpError, Keyboard, session, SessionFlavor, Context} from 'grammy';
import { LabeledPrice } from 'typegram/payment';
import { InlineQueryResultArticle } from 'typegram/inline';
import { config } from 'dotenv';
import { InlineQueryResult } from 'typegram';

config(); // Load environment variables from .env file
const adminUserIds = process.env.ADMIN_USER_IDS?.split(',').map(Number) || [];

// Define session structure

// Define a list of commands with their descriptions

// Define user commands
const userCommands = [
    { command: 'start', description: 'Start interacting with the bot' },
    { command: 'pay', description: 'Make a payment' },
];

// Define admin commands
const adminCommands = [
    { command: 'settings', description: 'Adjust bot settings' },
    { command: 'lesson', description: 'Manage lessons' },
    { command: 'notes', description: 'Take notes' },
];


let paymentOptions = [
    { label: 'Option 1', amount: 1000 },
    { label: 'Option 2', amount: 2000 },
    { label: 'Option 3', amount: 3000 },
];


async function fetchPaymentOptions() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://localhost:3002', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        paymentOptions = data; // Update payment options with data from the server
    } catch (error) {
        console.error('Failed to fetch payment options:', error);
        // If there's an error or timeout, keep the default paymentOptions
    }
}

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

bot.use(session({
    initial: (): MySession => ({ step: 'idle', editIndex: null }),
}));

bot.api.setMyCommands(userCommands); // Default to user commands


// Logic to switch between user and admin commands
bot.command('admin', async (ctx) => {
    if (!ctx.from || !adminUserIds.includes(ctx.from.id)) return;
    await ctx.api.setMyCommands(adminCommands, { scope: { type: 'chat', chat_id: ctx.chat.id } });
    await ctx.reply('Switched to admin commands.');
});

bot.command('user', async (ctx) => {
    if (!ctx.from || !adminUserIds.includes(ctx.from.id)) return;
    await ctx.api.setMyCommands(userCommands, { scope: { type: 'chat', chat_id: ctx.chat.id } });
    await ctx.reply('Switched to user commands.');
});






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






bot.command('start', async (ctx) => {

    if (!ctx.from || !ctx.chat) return;

    console.log(adminUserIds.includes(ctx.from.id))

    let inlineKeyboard = new InlineKeyboard();
    let replyKeyboard = new Keyboard()
        .resized(); // Make the keyboard smaller

    // Check if the user is an administrator
    if (adminUserIds.includes(ctx.from.id)) {
        // Administrator commands
        inlineKeyboard
            .text('Настройки', 'settings')
            .text('Уроки', 'lesson')
            .text('Рассылки', 'notes');
    } else {
        // Regular user commands
        inlineKeyboard
            .webApp('Перети на сайт', 'https://goldenspeak.ru/')
            .text('Оплатить', 'pay');
    }


    if (adminUserIds.includes(ctx.from.id)) {
        // Add Admin and User buttons to the reply keyboard for administrators
        replyKeyboard
            .text('О нас')
            .text('Admin')
            .text('User');

        await ctx.reply('Здравствуйте, Администратор', {
            reply_markup: replyKeyboard
        });
    }

    await ctx.reply('Здравствуйте! Чем можем быть вам полезны?', {
        reply_markup: inlineKeyboard,
    });






});





bot.callbackQuery('settings', async (ctx) => {
    if (!ctx.from || !adminUserIds.includes(ctx.from.id)) return;

    let messageText = 'Adjust payment options:\n';
    const settingsKeyboard = new InlineKeyboard();

    paymentOptions.forEach((option, index) => {
        messageText += `${index + 1}. ${option.label} - ${option.amount / 100} USD\n`;
        settingsKeyboard.text(`Edit ${index + 1}`, `edit_${index}`);
    });

    await ctx.editMessageText(messageText, {
        reply_markup: settingsKeyboard,
    });
});




// Edit payment option callback
// Settings command for administrators
bot.callbackQuery(/^edit_\d+$/, async (ctx) => {
    if (!ctx.from || !adminUserIds.includes(ctx.from.id)) return;

    const index = parseInt(ctx.callbackQuery.data.split('_')[1]);
    ctx.session.editIndex = index; // Store the index of the payment option being edited
    ctx.session.step = 'awaiting_label'; // Set the next step

    await ctx.reply('Please enter the new label for the payment option:');
});


// Handle messages from admins to update payment options
bot.on('message:text', async (ctx) => {
    if (!ctx.from || !adminUserIds.includes(ctx.from.id) || !ctx.message.text) return;

    const index = ctx.session.editIndex;
    if (index === null || ctx.session.step === 'idle') return; // No payment option is being edited

    if (ctx.session.step === 'awaiting_label') {
        // Update the label and prompt for the amount
        paymentOptions[index].label = ctx.message.text;
        ctx.session.step = 'awaiting_amount';
        await ctx.reply('Please enter the new amount for the payment option (in cents):');
    } else if (ctx.session.step === 'awaiting_amount') {
        // Update the amount and reset the session
        const amount = parseInt(ctx.message.text);
        if (!isNaN(amount)) {
            paymentOptions[index].amount = amount;
            ctx.session.step = 'idle';
            ctx.session.editIndex = null;

            await ctx.reply('Changes have been made.');

            // Show the options table again
            let messageText = 'Current payment options:\n';
            const settingsKeyboard = new InlineKeyboard();

            paymentOptions.forEach((option, index) => {
                messageText += `${index + 1}. ${option.label} - ${option.amount / 100} USD\n`;
                settingsKeyboard.text(`Edit ${index + 1}`, `edit_${index}`);
            });

            await ctx.reply(messageText, {
                reply_markup: settingsKeyboard,
            });
        } else {
            await ctx.reply('Invalid amount. Please enter a number in cents.');
        }
    }
});

bot.callbackQuery('pay', async (ctx) => {
    await fetchPaymentOptions();
    console.log('pay', ctx)
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

