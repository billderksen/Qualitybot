require('dotenv').config();
module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX.length
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return
    }
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'commands') {
        client.commands.get('commands').execute(client, message, client.commands, Discord);
    }
    try {
        client.commands.get(command).execute(client, message, args, Discord);
    } catch(e) {
        message.channel.send('invalid command!');
    }
}