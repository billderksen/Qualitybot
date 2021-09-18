module.exports = {
    name: 'ping',
    description: "Play ping pong",
    execute(client, message, args) {
        message.channel.send('pong!');
    }
}