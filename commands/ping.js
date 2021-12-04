module.exports = {
    name: 'ping',
    description: "Play ping pong",
    cooldown: 1,
    pings: 0,
    async execute(client, message, args, Discord) {
        message.channel.send('pong!');
    }
}