module.exports = {
    name: 'stats',
    description: 'Lists all commands',
    pings: 0,
    async execute(client, message, args, Discord) {

        let commands = [];
        let i = 0;
        for (const [key, value] of args.entries()) {
            commands.push({name: '', value: ''});
            commands[i].name = `__${value.name}__`;
            commands[i].value = `Calls: ${value.pings}`;
            commands[i].inline = true;
            i++;
        }

        const commandsEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Qualitybot Commands')
        .setURL('https://github.com/yourimv/Qualitybot')
        .setAuthor('Youri | Qualitytime', 'https://i.imgur.com/A2lw57a.png', 'https://github.com/yourimv/Qualitybot')
        .setThumbnail('https://i.imgur.com/A2lw57a.png')
        .addFields(
            { name: 'Uptime', value: `${new Date((client.uptime / 1000) * 1000).toISOString().substr(11, 8)}` },
            commands
        )
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Click the link to view the bot\'s source code', 'https://i.imgur.com/YzyMfFO.png');

        message.channel.send(commandsEmbed);
    }
}