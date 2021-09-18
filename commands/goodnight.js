module.exports = {
    name: 'goodnight',
    description: "The bot says good night",
    execute(client, message, args) {
        message.reply('Good night!');
    }
}