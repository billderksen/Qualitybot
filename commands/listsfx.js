const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'listsfx',
    description: 'View all sfx saved in the mongodb',

    async execute(client, message, args) {


        try {
            const query = await soundfxModel.find({ server: message.guild.id });

            if (query) {
                let str = "";

                for (let i = 0; i < query.length; i++) {
                    str += `__**Sound name:**__ ${query[i].name}\n`
                }
                message.channel.send(str || "You don't have any SFX added for your guild!");
            }
        } catch (err) {
            console.log(err)
        }
    }
}