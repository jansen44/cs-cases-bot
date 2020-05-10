const Discord = require('discord.js')

const handlers = require('./handlers')
const {
  GetCommand,
  Log,
  ShouldNotReadMessage,
  ShouldLogMessage
} = require('./util')

const client = new Discord.Client()

client.on('ready', () => Log.info(`Logged in as ${client.user.tag}`))

client.on('message', msg => {
  if (ShouldLogMessage(msg)) { Log.message(msg) }
  if (ShouldNotReadMessage(msg, handlers)) { return }

  try {
    const [command, ...args] = GetCommand(msg, handlers)

    Log.info(`Executing command ${command}(${args})`)

    handlers[command].action(msg, args)
  } catch (err) {
    Log.error({ location: 'client.on(\'message\')', err })
  }
})

module.exports = client
