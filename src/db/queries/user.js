const { User } = require('../schemas/user')

module.exports.findUser = message => User.findOne({
  discord_id: message.author.id,
  discord_guild_id: message.channel.guild.id
})

module.exports.createUser = message => User.create({
  discord_id: message.author.id,
  discord_username: message.author.username,
  discord_guild_id: message.channel.guild.id,
  total_profit: 0,
  total_spent: 0,
  inventory: []
})

module.exports.updateProfit = (_id, total_profit) => User.updateOne({ _id }, { total_profit })
