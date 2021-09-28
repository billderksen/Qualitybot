module.exports = {
    name: 'commands',
    description: 'Lists all commands',
    async execute(client, message, args, Discord) {

        let commands = [];
        let i = 0;
        for (const [key, value] of args.entries()) {
            commands.push({name: '', value: ''});
            commands[i].name = `${value.name}`;

            commands[i].value = `${value.description}`;
            if (value.aliases) {
                commands[i].aliases = [];
                for (const a of value.aliases) {
                    commands[i].aliases.push({name:`${a}`})
                }
            }
            i++;
        }

        i = 0;
        for (const c of commands) {
            if (c.aliases && c.aliases.length > 0) {
                commands.splice(i+1,0, { name: `\'${c.name}\' command aliases:`, value: `Additional functionalities in ${c.name}` })
                let vi = 0;
                let ai = 2;
                for (const a of c.aliases) {
                    commands.splice(i+ai,0, { name: `Alias ${vi}` , value: a.name, inline: true })
                    ai++;
                    vi++;
                }
            }
            i++;
        }

        const commandsEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Qualitybot Commands')
        .setURL('https://github.com/yourimv/Qualitybot')
        .setAuthor('Youri | Qualitytime', 'https://i.imgur.com/A2lw57a.png', 'https://github.com/yourimv/Qualitybot')
        .setThumbnail('https://i.imgur.com/A2lw57a.png')
        .addFields(
            commands
        )
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Click the link to view the bot\'s source code', 'https://i.imgur.com/YzyMfFO.png');

        message.channel.send(commandsEmbed);
    }
}