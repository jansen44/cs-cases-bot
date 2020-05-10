const { Log } = require('../util')
const { Cases } = require('../db/schemas/cases')

const { getItems, getPrices } = require('./util')

const iconBaseUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/'

module.exports.populateItems = async () => {
  try {
    const { items, updated } = await getItems()
    const { prices, _updated } = await getPrices()

    const _items = Object.keys(items).map(k => items[k])

    let cases = getCases(items, prices).sort((a, b) => a.avg_price_dollar - b.avg_price_dollar)

    cases.forEach(c => {
      c.descriptions.forEach(desc => {
        const foundItems = _items.filter(item => item.market_name.includes(desc.value))

        if (foundItems.length > 0) {
          const newItem = {
            name: desc.value,
            color: desc.color,
            rarity: foundItems[0].tags.find(tag => tag.category === 'Rarity').name,
            icon_url: '',
            variants: []
          }

          foundItems.forEach(item => {
            if (item.market_name.includes('Factory New')) {
              newItem.icon_url = `${iconBaseUrl}${item.icon_url}`
            } else if (item.market_name.includes('Minimal Wear') && newItem.icon_url === '') {
              newItem.icon_url = `${iconBaseUrl}${item.icon_url}`
            } else if (item.market_name.includes('Field-Tested') && newItem.icon_url === '') {
              newItem.icon_url = `${iconBaseUrl}${item.icon_url}`
            } else if (item.market_name.includes('Well-Worn') && newItem.icon_url === '') {
              newItem.icon_url = `${iconBaseUrl}${item.icon_url}`
            } else if (item.market_name.includes('Battle-Scarred') && newItem.icon_url === '') {
              newItem.icon_url = `${iconBaseUrl}${item.icon_url}`
            }

            newItem.variants.push(formatItem(item, prices))
          })

          newItem.variants = newItem.variants.sort((a, b) => a.avg_price - b.avg_price)

          c.items.push(newItem)
        }
      })
    })

    Log.info('Inserting Cases on Database')
    await Cases.insertMany(cases)

  } catch (err) {
    Log.error({ location: 'hexaone/populateItem', err })
    throw (err)
  }
}

function getCases(items, prices) {
  let cases = []

  for (let item in items) {
    if (
      items[item].tags.some(tag => tag.internal_name === 'CSGO_Type_WeaponCase')
      && (items[item].market_name.includes('case')
        || items[item].market_name.includes('Case')
        || items[item].market_name.includes('Souvenir Package')
        || items[item].market_name.includes('souvenir package')
      )
    ) {
      let price = prices[items[item].market_name]

      if (!price) { price = null }
      else if (!price['7']) {
        price = price['365']
          ? price['365']['avg']
          : null
      }
      else { price = price['7']['avg'] }

      if (price === null) { continue }

      cases.push({
        descriptions: items[item].descriptions,
        name: items[item].market_name,
        icon_url: `${iconBaseUrl}${items[item].icon_url}`,
        items: [],
        basic_items: [],
        avg_price: price,
        avg_price_dollar: price,
        base_currency_calc: 1
      })
    }
  }

  return cases
}

function formatItem(item, prices) {
  let price = prices[item.market_name]

  if (!price) { price = null }
  else if (!price['7']) {
    price = price['365']
      ? price['365']['avg']
      : null
  }
  else { price = price['7']['avg'] }

  return {
    name: item.market_name,
    tags: item.tags.filter(tag => tag.category === 'Type'
      || tag.category === 'Weapon'
      || tag.category === 'Rarity'
      || tag.category === 'Exterior'
      || tag.name === "StatTrak™"
    ),
    icon_url: `${iconBaseUrl}${item.icon_url}`,
    avg_price: price,
    avg_price_dollar: price
  }
}
