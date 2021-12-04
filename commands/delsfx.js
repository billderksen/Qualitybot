const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'delsfx',
    description: 'Delete sound effect from the mongodb',
    cooldown: 5,
    pings: 0,
    async execute(client, message, args) {
        try {
            const query = await soundfxModel.findOne({ name: args[0], server: message.guild.id});

            if (query) {
                const sfx = await soundfxModel.deleteOne(query)
                message.channel.send(`**Deleted SFX:** ${query.name}`)
            } else {
                message.channel.send(`Your guild does not have this soundFX!`)
            }
        } catch (err) {
            message.channel.send(`Error code: ${err.code}`)
            throw err;
        }
    }
}