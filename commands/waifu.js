const soundfxModel = require('../models/soundFx')
const Booru = require('booru')
require('dotenv').config()

module.exports = {
    name: 'waifu',
    description: `Get an image from ${process.env.BOORUSITE}`,

    async execute(client, message, args, Discord) {

        Booru.search(`${process.env.BOORUSITE}`, [`${args.join('_')}`], { limit: 1, random: true })
        .then(posts => {
            if (posts.length > 0) {
                return message.channel.send(posts[0].fileUrl)
            } else {
                return message.channel.send(`No results for ${args.join('_')}`)
            }

        })
    }
}