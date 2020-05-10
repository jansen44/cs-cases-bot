const { Message } = require('discord.js')

// * General ================================================
function BuildBaseMessage(msg) {
  return [
    new Message(process.env.CLIENT_ID, {}, msg.channel.id),
    msg.channel
  ]
}

function GetCommand(msg, handlers) {
  return CheckCommand(msg, handlers)
    .slice(1, 3)
    .map(m => m.trim())
}

// * Validations ===========================================
function CheckIfTargetChannel(msg) {
  return msg.channel.name === process.env.TARGET_CHANNEL_NAME
}

function CheckCommand(msg, handlers) {
  const reg = new RegExp(`^(${Object.keys(handlers).join('|')})(.*)`)
  return reg.exec(msg.content)
}

function CheckIfOwnMessage(msg) {
  return msg.author.id === process.env.CLIENT_ID
}

function ShouldLogMessage(msg) {
  return CheckIfTargetChannel(msg) && !CheckIfOwnMessage(msg)
}

function ShouldReadMessage(msg, handlers) {
  return CheckIfTargetChannel(msg) && CheckCommand(msg, handlers) && !CheckIfOwnMessage(msg)
}

function ShouldNotReadMessage(msg, handlers) {
  return !ShouldReadMessage(msg, handlers)
}

module.exports = {
  BuildBaseMessage,
  CheckIfTargetChannel,
  CheckCommand,
  CheckIfOwnMessage,
  GetCommand,
  ShouldReadMessage,
  ShouldLogMessage,
  ShouldNotReadMessage
}
