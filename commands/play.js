const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
require('dotenv').config();
const queue = new Map();
module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'queue', 'clear', 'leave', 'volume'],
    description: 'Joins and plays a video from youtube',
    async execute(client, message, args) {
        // CMD var to catch aliases
        const cmd = message.content.slice(process.env.PREFIX.length).split(/ +/)[0];

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command.');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions.');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions.');
        const serverQueue = queue.get(message.guild.id);

        const validURL = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            return regex.test(str);
        }

        const videoPlayer = async (guild, song) => {
            const songQueue = queue.get(guild.id);

            if (!song) {
                songQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const stream = ytdl(song.url, { filter: 'audioonly' });
            songQueue.connection.play(stream, { seek: 0, volume: 1 })
            .on('finish', () => {
                songQueue.songs.shift();
                videoPlayer(guild, songQueue.songs[0]);
            });
            await songQueue.textChannel.send(`Now playing **${song.title}**`)
        }

        const skipSong = (message, serverQueue) => {
            if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command');
            if(!serverQueue){
                return message.channel.send(`There are no songs in the queue`);
            }
            serverQueue.connection.dispatcher.end();
        }

        const stopSong = (message, serverQueue) => {
            if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command');
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }

        const showQueue = (message, serverQueue) => {
            if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command');
            if(serverQueue){
                let songs = "";
                let count = 1;

                serverQueue.songs.forEach(e => {
                    songs += `${count}: ${e.title} \n`
                    count = count + 1;
                });
                return message.channel.send(`${songs}`);
            } else {
                return message.channel.send(`There are no songs in the queue`);
            }
        }

        const clearQueue = (message, serverQueue) => {
            queue.delete(message.guild.id);
            return message.channel.send(`Music queue has been cleared`);
        }

        const leaveVoicechannel = (message, serverQueue) => {
            const songQueue = queue.get(message.guild.id);

            queue.delete(message.guild.id);
            if (songQueue) {
                songQueue.voiceChannel.leave();
                return message.channel.send('Leaving channel :wave:')
            }
        }

        const changeVolume = (message, serverQueue) => {
            if (isNaN(args[0])) return message.channel.send('Please input a number');
            const songQueue = queue.get(message.guild.id);
            songQueue.connection.dispatcher.setVolume(args[0]);
            return message.channel.send(`Changed volume to ${args[0]}`);
        }

        if (cmd === 'play') {
            if (!args.length) return message.channel.send('You need to send the second argument.');
            let song = {};
            if (ytdl.validateURL(args[0])) {
                const songInfo = await ytdl.getInfo(args[0]);
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }
            } else {
                const videoFinder = async (query) =>{
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                     message.channel.send('Error finding video');
                }
            }

            if (!serverQueue) {
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);

                try {
                    const connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    videoPlayer(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting to vc');
                    throw err;
                }
            }
            else {
                serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}** added to queue!`);
            }
        }
        else if (cmd === 'skip') skipSong(message, serverQueue);
        else if (cmd === 'stop') stopSong(message, serverQueue);
        else if (cmd === 'queue') showQueue(message, serverQueue);
        else if (cmd === 'clear') clearQueue(message, serverQueue);
        else if (cmd === 'leave') leaveVoicechannel(message, serverQueue);
        else if (cmd === 'volume') changeVolume(message, serverQueue);
    }
}