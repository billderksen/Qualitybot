const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'listsfx',
    description: 'View all sfx saved in the mongodb',
    cooldown: 5,
    pings: 0,
    async execute(client, message, args, Discord) {


        try {
            const query = await soundfxModel.find({ server: message.guild.id });
            let sounds = [];
            if (query) {
                let str = "";
                let sfx = []
                for (let i = 0; i < query.length; i++) {
                    sfx.push({name : query[i].name, value: '\u200B', inline: true});
                }


                const commandsEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Your guild\'s Sound FX')
                .setURL('https://github.com/yourimv/Qualitybot')
                .setAuthor('Youri | Qualitytime', 'https://i.imgur.com/A2lw57a.png', 'https://github.com/yourimv/Qualitybot')
                .setThumbnail('')
                .addFields(
                    sfx.length > 0 ? sfx : {name: 'none', value: '\u200B', inline: true}
                )
                // .setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                .setFooter('Click the link to view the bot\'s source code', 'https://i.imgur.com/YzyMfFO.png');

                message.channel.send(commandsEmbed);
            }
        } catch (err) {
            console.log(err)
        }
    }
}