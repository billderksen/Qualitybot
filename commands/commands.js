module.exports = {
    name: 'commands',
    description: 'Lists all commands',
    async execute(client, message, args) {
        let msg = "";
        for (const [key, value] of args.entries()) {
            msg += `**Command:** ${value.name}\n`;
            msg += `${value.description}\n\n`;
        }
        if (msg) {
            message.channel.send(msg);
        }

    }
}