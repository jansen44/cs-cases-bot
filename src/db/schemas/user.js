const mongoose = require('mongoose')

const User = new mongoose.Schema({
  discord_username: String,
  discord_id: String,
  discord_guild_id: String,
  total_profit: Number,
  total_spent: Number,
  inventory: [String]
}, { versionKey: false })

module.exports.User = mongoose.model('User', User)
