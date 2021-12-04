module.exports = {
    name: 'goodnight',
    description: "The bot says good night",
    cooldown: 1,
    pings: 0,
    async execute(client, message, args) {
        message.reply('Good night!');
    }
}