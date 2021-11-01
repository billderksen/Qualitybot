const soundfxModel = require('../models/soundFx')
const Booru = require('booru')
require('dotenv').config()

module.exports = {
    name: 'waifu',
    description: `Get an image from ${process.env.BOORUSITE}. Example: "Shirakami Fubuki" "Hololive"`,
    pings: 0,
    async execute(client, message, args, Discord) {

        let query = [];
        for (let t of args.join(" ").split("\"").filter(e => e.length > 1)) {
            query.push(t.replace(/\s+/g,"_"))
        }

        Booru.forSite(process.env.BOORUSITE).search(query, { limit: 1, random: true })
        .then(posts => {
            if (posts.length > 0) {
                return message.channel.send(posts[0].fileUrl)
            } else {
                return message.channel.send(`No results for ${args.join(' ')}`)
            }

        })
        .catch(err => {
            message.channel.send(`Error: ${err}`)
        })
    }
}