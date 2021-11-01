module.exports = {
    name: 'stats',
    description: 'Lists all stats',
    pings: 0,
    async execute(client, message, args, Discord) {

        let stats = [];
        let i = 0;
        for (const [key, value] of args.entries()) {
            stats.push({name: '', value: ''});
            stats[i].name = `__${value.name}__`;
            stats[i].value = `Calls: ${value.pings}`;
            stats[i].inline = true;
            i++;
        }

        const statsEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Qualitybot Statistics')
        .setURL('https://github.com/yourimv/Qualitybot')
        .setAuthor('Youri | Qualitytime', 'https://i.imgur.com/A2lw57a.png', 'https://github.com/yourimv/Qualitybot')
        .setThumbnail('https://i.imgur.com/A2lw57a.png')
        .addFields(
            { name: 'Uptime', value: `${new Date((client.uptime / 1000) * 1000).toISOString().substr(11, 8)}` },
            stats
        )
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Click the link to view the bot\'s source code', 'https://i.imgur.com/YzyMfFO.png');

        message.channel.send(statsEmbed);
    }
}