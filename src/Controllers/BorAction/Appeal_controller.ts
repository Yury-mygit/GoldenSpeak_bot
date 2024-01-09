class AppealController {
    async handleAppeal(ctx:any) {
        ctx.session.appealState = 'awaiting_input';
        await ctx.reply('Please send the text of your appeal along with any photo or video.');
    }
}

export default new AppealController();
