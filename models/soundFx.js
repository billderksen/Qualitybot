const mongoose = require('mongoose')

const soundFxSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    file: { type: String, require: true }
})

const model = mongoose.model("SoundFxModels", soundFxSchema)

module.exports = model