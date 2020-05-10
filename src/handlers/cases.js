const { BuildBaseMessage, Log, sliceFields, constants } = require('../util')
const { getCaseInfo, getCaseList, getPackageList } = require('../db/queries/cases')
const { findUser } = require('../db/queries/user')

module.exports.cs_cases = {
  description: 'Mostra lista de caixas disponíveis.',
  action: async (message) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const cases = await getCaseList()

      let filteredCases = sliceFields(cases)

      for (let caseIndex in filteredCases) {
        channel.send({
          embed: {
            color: '#0099ff',
            title: `Lista de caixas disponíveis (${parseInt(caseIndex) + 1}/${filteredCases.length}):`,
            fields: filteredCases[caseIndex].map(c => ({
              name: c.name, value: `R$ ${c.avg_price.toFixed(2)}`, inline: true
            }))
          }
        })
      }

    } catch (err) {
      console.log(err)
      Log.error({ location: 'cs_cases', err })
    }
  }
}

module.exports.cs_packages = {
  description: 'Mostra lista de pacotes disponíveis.',
  action: async (message) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const cases = await getPackageList()

      let filteredCases = sliceFields(cases)

      for (let caseIndex in filteredCases) {
        channel.send({
          embed: {
            color: '#0099ff',
            title: `Lista de caixas disponíveis (${parseInt(caseIndex) + 1}/${filteredCases.length}):`,
            fields: filteredCases[caseIndex].map(c => ({
              name: c.name, value: `R$ ${c.avg_price.toFixed(2)}`, inline: true
            }))
          }
        })
      }
    } catch (err) {
      Log.error({ location: 'cs_packages', err })
    }
  }
}

module.exports.cs_case = {
  description: 'Checar informações de uma caixa.',
  action: async (message, args) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const selectedCase = await getCaseInfo(args[0])

      if (!selectedCase) {
        reply.content = 'Caixa não encontrada ou indisponível!\n\nComo usar: cs_case nome_de_uma_caixa\nExemplo: ```cs_case hydra```'
        return channel.send(reply)
      }

      const fields = selectedCase.items.map(item => ({
        name: item.name, value: item.rarity, inline: true
      }))

      reply.embed = {
        title: `${selectedCase.name} - R$ ${selectedCase.avg_price.toFixed(2)}`,
        thumbnail: { url: selectedCase.icon_url },
        color: '#0099ff',
        fields: fields
      }

      message.channel.send(reply)
    } catch (err) {
      Log.error({ location: 'cs_case', err })
    }
  }
}

module.exports.cs_info_case = {
  description: 'Checar todas as informações de uma caixa.',
  action: async (message, args) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const selectedCase = await getCaseInfo(args[0])

      if (!selectedCase) {
        reply.content = 'Caixa não encontrada ou indisponível!\n\nComo usar: cs_case nome_de_uma_caixa\nExemplo: ```cs_case hydra```'
        return channel.send(reply)
      }

      channel.send(`Informações da caixa '${selectedCase.name}' estão sendo enviadas por DM.`)

      reply.embed = {
        title: `${selectedCase.name}`,
        description: `R$ ${selectedCase.avg_price}`,
        thumbnail: { url: selectedCase.icon_url },
        fields: [{ name: 'Total de skins', value: selectedCase.items.length }],
        color: '#0099ff',
      }

      message.author.send(reply)

      selectedCase.items.forEach(item => {
        const embed = {
          title: item.name,
          color: item.color,
          fields: item.variants.map(variant => ({
            name: variant.name,
            value: `R$ ${variant.avg_price.toFixed(2)}`,
            inline: variant.name.length < 20
          })),
          image: { url: item.icon_url }
        }

        message.author.send({ embed })
      })
    } catch (err) {
      Log.error({ location: 'cs_info_case', err })
    }
  }
}

module.exports.cs_open = {
  description: 'Abre uma caixa',
  action: async (message, args) => {
    try {
      const [reply, channel] = BuildBaseMessage(message)

      const user = await findUser(message)
      if (!user) { return channel.send('Por favor, crie uma conta com \'cs_start\' primeiro!') }

      const selectedCase = await getCaseInfo(args[0])
      if (!selectedCase) { return channel.send('Caixa não encontrada ou indisponível!\n\nComo usar: cs_open nome_de_uma_caixa\nExemplo: ```cs_open hydra```') }

      const groupedItems = []

      for (let rg of constants.rarityGroups) {
        groupedItems.push({
          chanceRange: rg.chanceRange,
          items: selectedCase.items.filter(item => rg.rarities.includes(item.rarity))
        })
      }

      const luckCaseRarity = (Math.random() * constants.maxChanceNumber) + 1

      const luckRarityGroup = groupedItems.find(g => g.chanceRange[0] <= luckCaseRarity && g.chanceRange[1] >= luckCaseRarity)

      const selectedItem = luckRarityGroup.items[Math.floor(Math.random() * luckRarityGroup.items.length)]

      const selectedVariant = selectedItem.variants[Math.floor(Math.random() * selectedItem.variants.length)]

      reply.embed = {
        title: selectedCase.name,
        description: message.author.username,
        color: selectedItem.color,
        fields: [
          { name: selectedVariant.name, value: `R$ ${selectedVariant.avg_price.toFixed(2)}` }
        ],
        image: { url: selectedVariant.icon_url },
        thumbnail: { url: selectedCase.icon_url }
      }

      user.total_spent += (selectedCase.name.includes('Case') || selectedCase.name.includes('case'))
        ? parseFloat(constants.keyPrice(selectedCase.base_currency_calc))
        : 0
      user.total_spent += selectedCase.avg_price

      user.inventory.push(selectedVariant.name)
      user.save()

      channel.send(reply)
    } catch (err) {
      Log.error({ location: 'cs_open', err })
    }
  }
}

