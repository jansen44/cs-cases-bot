const { BuildBaseMessage, Log, sliceFields } = require('../util')
const { findUser, createUser } = require('../db/queries/user')
const { getVariantListInfo } = require('../db/queries/item')

module.exports.cs_start = {
  description: 'Criar uma conta para abrir caixas',
  action: async (message) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const user = await findUser(message)

      if (!user) {
        await createUser(message)
        reply.content = `${message.author.username}, let's roll`
      } else {
        reply.content = 'Parece que você já possui uma conta, não é mesmo pnc?'
      }

      channel.send(reply)
    } catch (err) {
      Log.error({ location: 'cs_start', err })
    }
  }
}

module.exports.cs_info_user = {
  description: 'Verificar o status do seu usuário\n \'**cs_info_user --pub**\' envia informações no próprio canal',
  action: async (message, args) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const targetChannel = args[0] === '--pub' ? channel : message.author

      const user = await findUser(message)

      if (!user) { return channel.send('Por favor, crie uma conta com \'cs_start\' primeiro!') }

      const inventory = await getVariantListInfo(user.inventory)

      user.total_profit = inventory.reduce((profit, i) => profit + (i.avg_price * i.amount), 0)

      await user.save()

      const serverName = channel.guild.name

      reply.embed = {
        title: `Info no servidor '${serverName}':`,
        color: '#0099ff',
        fields: [
          { name: 'Total Gasto', value: `R$ ${user.total_spent.toFixed(2)}`, inline: true },
          { name: 'Valor do Inventário', value: `R$ ${user.total_profit.toFixed(2)}`, inline: true },
          { name: 'Lucro Total', value: `R$ ${(user.total_profit - user.total_spent).toFixed(2)}` }
        ]
      }

      targetChannel.send(reply)
      if (args[0] !== '--pub') { message.reply('informações enviadas por DM!') }

      const slicedInv = sliceFields(inventory)

      for (let itemsIndex in slicedInv) {
        targetChannel.send({
          embed: {
            title: `Inventário (${parseInt(itemsIndex) + 1}/${slicedInv.length})`,
            color: slicedInv[itemsIndex][slicedInv[itemsIndex].length - 1].color,
            image: {
              url: slicedInv[itemsIndex][slicedInv[itemsIndex].length - 1].icon_url
            },
            fields: slicedInv[itemsIndex].map(variant => ({
              name: variant.amount > 1 ? `${variant.name} x ${variant.amount}` : variant.name,
              value: variant.amount > 1
                ? `R$ ${variant.avg_price.toFixed(2)} (R$ ${(variant.avg_price * variant.amount).toFixed(2)})`
                : `R$ ${variant.avg_price.toFixed(2)}`,
              inline: true
            }))
          }
        })
      }

    } catch (err) {
      Log.error({ location: 'cs_info_user', err })
    }
  }
}
