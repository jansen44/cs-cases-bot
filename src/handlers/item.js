const { BuildBaseMessage, Log, sliceFields } = require('../util')
const { getSkinInfo } = require('../db/queries/item')

module.exports.cs_skin = {
  description: 'Mostra informações de uma caixa.',
  action: async (message, args) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const { item, cases } = await getSkinInfo(args)

      if (!item) {
        reply.content = 'Item não encontrado ou indisponível!\n\nComo usar: cs_skin nome_do_item\nObs.: é necessário o nome do item INTEIRO.\nExemplo: ```cs_skin AWP | Lightning Strike```'
        return channel.send(reply)
      }

      const filteredVariants = sliceFields(item.variants)

      for (let variantIndex in filteredVariants) {
        const embed = {
          title: `${item.name} (${parseInt(variantIndex) + 1}/${filteredVariants.length})`,
          color: item.color,
          fields: item.variants.map(variant => ({
            name: variant.name,
            value: `R$${variant.avg_price}`,
            inline: true
          }))
        }

        if (parseInt(variantIndex) === filteredVariants.length - 1) {
          embed.description = cases.map(c => `**${c.name}**\nR$ ${c.avg_price}`).join('\n')
          embed.image = { url: item.icon_url }
        }

        channel.send({ embed })
      }
    } catch (err) {
      Log.error({ location: 'cs_skin', err })
    }
  }
}
