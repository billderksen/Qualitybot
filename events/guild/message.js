require('dotenv').config();

const cooldowns = new Map();

module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX.length
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return
    }
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));


    try {
        if (!cooldowns.has(cmd.name)) {
            cooldowns.set(cmd.name, new Discord.Collection());
        }

        const current_time = Date.now();
        const time_stamps = cooldowns.get(cmd.name);
        const cooldown_amount = (cmd.cooldown) * 1000;

        if (time_stamps.has(message.author.id)) {
            const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;

                return message.reply(`Please wait ${time_left.toFixed(1)} more seconds before using ${cmd.name}`);
            }
        }

        time_stamps.set(message.author.id, current_time);
        setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

        if (cmd.name === 'commands' || cmd.name === 'stats') {
            cmd.execute(client, message, client.commands, Discord);
            command.pings++;
        } else {
            cmd.execute(client, message, args, Discord)
        }
        cmd.pings++;
    } catch (e) {
    }
}