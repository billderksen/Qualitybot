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

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        const statsEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Qualitybot Statistics')
        .setURL('https://github.com/yourimv/Qualitybot')
        .setAuthor('Youri | Qualitytime', 'https://i.imgur.com/A2lw57a.png', 'https://github.com/yourimv/Qualitybot')
        .setThumbnail('https://i.imgur.com/A2lw57a.png')
        .addFields(
            { name: 'Uptime', value: uptime },
            stats
        )
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Click the link to view the bot\'s source code', 'https://i.imgur.com/YzyMfFO.png');

        message.channel.send(statsEmbed);
    }
}