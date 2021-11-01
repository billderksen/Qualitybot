const soundfxModel = require('../models/soundFx')

module.exports = {
    name: 'playsfx',
    description: 'Play sfx saved in the mongodb',
    pings: 0,
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command.');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions.');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions.');
        if (!args.length) return message.channel.send('You need to send the second argument.');
        try {
            const query = await soundfxModel.findOne({ name: args[0], server: message.guild.id});
            if (query) {
                const connection = await voiceChannel.join();
                connection.play(query.file, {seek: 0, volume: args[1] || 1})
                .on('finish', () =>{
                    voiceChannel.leave();
                });
            } else {
                message.channel.send('Your guild does have this soundFX.')
            }
        } catch (err) {
            message.channel.send('Error playing SFX')
            console.log(err)
        }
    }
}