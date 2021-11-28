const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

//Global queue for your bot. Every server will have a key and value pair in this map. { guild.id, queue_constructor{} }
const queue = new Map();

module.exports = {
  name: "play",
  aliases: ["skip", "stop", "queue", "volume"],
  cooldown: 0,
  description: "Music bot",
  async execute(client, message, args, Discord) {
    const cmd = message.content.slice(process.env.PREFIX.length).split(/ +/)[0];

    const voice_channel = message.member.voice.channel;
    if (!voice_channel)
      return message.channel.send(
        "You need to be in a channel to execute this command!"
      );
    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("You dont have the correct permissins");
    if (!permissions.has("SPEAK"))
      return message.channel.send("You dont have the correct permissins");

    const server_queue = queue.get(message.guild.id);

    if (cmd === "play") {
      if (!args.length)
        return message.channel.send("You need to send the second argument!");
      let song = {};

      if (ytdl.validateURL(args[0])) {
        const song_info = await ytdl.getInfo(args[0]);
        song = {
          title: song_info.videoDetails.title,
          url: song_info.videoDetails.video_url,
        };
      } else {
        const video_finder = async (query) => {
          const video_result = await ytSearch(query);
          return video_result.videos.length > 1 ? video_result.videos[0] : null;
        };

        const video = await video_finder(args.join(" "));
        if (video) {
          song = { title: video.title, url: video.url };
        } else {
          message.channel.send("Error finding video.");
        }
      }

      if (!server_queue) {
        const queue_constructor = {
          voice_channel: voice_channel,
          text_channel: message.channel,
          connection: null,
          songs: [],
        };

        queue.set(message.guild.id, queue_constructor);
        queue_constructor.songs.push(song);
        init_play(voice_channel, message, queue_constructor)

      } else {
        if (!client.voice.connections.get(message.guild.id)) {
          server_queue.songs = [];
          server_queue.songs.push(song);
          init_play(voice_channel, message, server_queue);
          video_player(message.guild, server_queue.songs[0]);
        } else {
          server_queue.songs.push(song);
          return message.channel.send(`👍 **${song.title}** added to queue!`);

        }
      }
    } else if (cmd === "skip") skip_song(message, server_queue);
    else if (cmd === "stop") stop_song(message, server_queue);
    else if (cmd === "queue") show_queue(message, server_queue, Discord);
    else if (cmd === "volume") change_volume(message, server_queue, args);
  },
};

const init_play = async (voice_channel, message, server_queue) => {
  try {
    const connection = await voice_channel.join();
    server_queue.connection = connection;
    video_player(message.guild, server_queue.songs[0]);
  } catch (err) {
    queue.delete(message.guild.id);
    message.channel.send("There was an error connecting!");
    throw err;
  }
};

const video_player = async (guild, song) => {
  const song_queue = queue.get(guild.id);

  if (!song) {
    song_queue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: "audioonly" });
  song_queue.connection
    .play(stream, { seek: 0, volume: 0.5 })
    .on("finish", () => {
      song_queue.songs.shift();
      video_player(guild, song_queue.songs[0]);
    });
  await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`);
};

const skip_song = (message, server_queue) => {
  if (!server_queue) {
    return message.channel.send(`There are no songs in queue 😔`);
  }
  server_queue.connection.dispatcher.end();
};

const stop_song = (message, server_queue) => {
  if (!server_queue) {
    return message.channel.send(`There are no songs in queue 😔`);
  }
  server_queue.songs = [];
  server_queue.connection.dispatcher.end();
};

const show_queue = (message, server_queue, Discord) => {
  if (!server_queue) {
    return message.channel.send(`There are no songs in queue 😔`);
  }
  let embed_array = [];
  let index = 1;
  server_queue.songs.forEach((e) => {
    embed_array.push({ name: `${index}. ${e.title}`, value: e.url });
    index++;
  });

  const queue_embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Music bot queue 🎧")
    .setURL("https://github.com/yourimv/Qualitybot")
    .setAuthor(
      "Youri | Qualitytime",
      "https://i.imgur.com/A2lw57a.png",
      "https://github.com/yourimv/Qualitybot"
    )
    .setThumbnail("https://i.imgur.com/A2lw57a.png")
    .addFields(embed_array)
    // .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter(
      "Click the link to view the bot's source code",
      "https://i.imgur.com/YzyMfFO.png"
    );

  return message.channel.send(queue_embed);
};

const change_volume = (message, server_queue, args) => {
  if (isNaN(args[0])) return message.channel.send("Please input a number");
  server_queue.connection.dispatcher.setVolume(args[0]);
  return message.channel.send(`🔊 Changed volume to ${args[0]}`);
};
