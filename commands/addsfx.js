const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'addsfx',
    description: 'Add sound effect to the mongodb',

    async execute(client, message, args) {

        const validURL = (str) => {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
            return regex.test(str)
        }

        const validFileExtension = (str) => {
            var regex = /\.(?:wav|mp3)$/i
            return regex.test(str)
        }

        let createObj
        switch (true) {
            case message.attachments.size > 0:
                createObj = {
                    name: message.attachments.entries().next().value[1].name.replace(/\.[^/.]+$/, ""),
                    file: message.attachments.entries().next().value[1].attachment
                }
                break
            case validFileExtension(args[1]):
                if (!validURL(args[1])) {
                    message.channel.send('URL is invalid')
                }
                else {
                    createObj = { name: args[0], file: args[1] }
                }
                break;
        }
        try {
            const sfx = await soundfxModel.create(createObj)
            sfx.save()
            message.channel.send(`**Created SFX:** ${sfx.name}`)
        } catch (err) {
            message.channel.send(`Error code: ${err.code}`)
        }
    }
}