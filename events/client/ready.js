require('dotenv').config()
module.exports = (Discord, client) => {
    console.log('Qualitybot is online')
    //client.user.setActivity("Game");
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activity: {
            name: ` ${process.env.PREFIX}commands for help`,
            type: 'STREAMING',
            url: 'https://www.twitch.tv/qualitytime'
        }
    });
}