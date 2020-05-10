const hexaone = require('hexa.one')
const fs = require('fs')

const { Log } = require('../util')

module.exports.getItems = function () {
  return new Promise((res, rej) => {
    const api = new hexaone(process.env.HEXAONE_API_KEY)
    Log.info('Loading items from external API...')

    api.getItems(730)
      .then(response => {
        Log.info('Done!')

        Log.info('Caching items locally...')
        fs.writeFileSync(__dirname + '/../../cache/items.json', JSON.stringify(response.result))

        Log.info('Done!')

        res(response.result)
      })
      .catch((err) => {
        Log.error({ location: 'hexaone - getItems()', err })

        Log.info('Using cached data.')
        res(JSON.parse(fs.readFileSync(__dirname + '/../../cache/items.json')))
      })
  })
}

module.exports.getPrices = function () {
  return new Promise((res, rej) => {
    const api = new hexaone(process.env.HEXAONE_API_KEY)
    Log.info('Loading prices from external API...')

    api.getPrices(730)
      .then(response => {
        Log.info('Done!')

        Log.info('Caching prices locally...')
        fs.writeFileSync(__dirname + '/../../cache/prices.json', JSON.stringify(response.result))

        Log.info('Done!')

        res(response.result)
      })
      .catch((err) => {
        Log.error({ location: 'hexaone - getPrices()', err })

        Log.info('Using cached data.')
        res(JSON.parse(fs.readFileSync(__dirname + '/../../cache/prices.json')))
      })
  })
}