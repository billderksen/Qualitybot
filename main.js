const Discord = require('discord.js')
require('dotenv').config();
const client = new Discord.Client()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 }).then(() => {
     console.log('Connected to mongoDB')
 }).catch((err) => {
     console.log(err)
 })

client.commands = new Discord.Collection()
client.events = new Discord.Collection()

const handlers = ['command_handler', 'event_handler'];
handlers.forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.DISCORD_TOKEN);