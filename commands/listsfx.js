const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'listsfx',
    description: 'View all sfx saved in the mongodb',

    async execute(client, message, args) {


        try {
            const query = await soundfxModel.find();

            if (query) {
                let str = "";

                for (let i = 0; i < query.length; i++) {
                    str += `__**Sound name:**__ ${query[i].name}\n`
                }
                message.channel.send(str);
            }
        } catch (err) {
            console.log(err)
        }
    }
}