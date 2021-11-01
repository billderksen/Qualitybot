module.exports = {
    name: 'goodnight',
    description: "The bot says good night",
    pings: 0,
    async execute(client, message, args) {
        message.reply('Good night!');
    }
}