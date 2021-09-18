const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'addsfx',
    description: 'Add a sound effect to the database',

    async execute(client, message, args) {

        const validURL = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)){
                return false
            } else {
                return true
            }
        }

        let sfx;
        if (message.attachments.size > 0) {
            try {
                sfx = await soundfxModel.create({
                    name: message.attachments.entries().next().value[1].name,
                    file: message.attachments.entries().next().value[1].attachment
                })
            } catch (err) {            
                message.channel.send(`Error code: ${err.code}`)
                return;
            }
        }
        else {
            if (validURL(args[1])) {
                if (args[1].endsWith('.mp3')) {
                    try {
                        sfx = await soundfxModel.create({
                            name: args[0],
                            file: args[1]
                        })
                    } catch (err) {
                        message.channel.send(`Error code: ${err.code}`)
                        return;
                    }
                }
            }
            else {
                message.channel.send('Entered URL is invalid')
            }
        }
        if (sfx) {
            message.channel.send(`**Created SFX:** ${sfx.name}`)
            sfx.save();
        }                
    }
}