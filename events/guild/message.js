require('dotenv').config();
module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX.length
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return
    }
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()

    try {
        const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));
        if (cmd.name === 'commands' || cmd.name === 'stats') {
            cmd.execute(client, message, client.commands, Discord);
            command.pings++;
        } else {
            cmd.execute(client, message, args, Discord)
        }
        cmd.pings++;
    } catch(e) {
    }
}