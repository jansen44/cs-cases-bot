const fetch = require('node-fetch')

const { Cases } = require('../schemas/cases')
const { Log } = require('../../util/logger')

module.exports.getCaseList = () => Cases.find({ name: /case/i }).select('name avg_price')

module.exports.getPackageList = () => Cases.find({ name: /package/i }).select('name avg_price')

module.exports.getCaseInfo = c => Cases.findOne({ name: { $regex: c, $options: 'i' } })

module.exports.updateCurrencies = () => new Promise(async (res, rej) => {
  const response = await fetch('https://api.exchangeratesapi.io/latest?base=USD&symbols=BRL')
  const data = await response.json()
  const currentReal = data.rates.BRL

  Cases.find({}, async (err, cases) => {
    if (err) { res(Log.error({ location: 'updateCurrencies', err })) }

    for (let c of cases) {
      const items = c.items.map(item => {
        item.variants = item.variants.map(variant => {
          variant.avg_price = (variant.avg_price_dollar * currentReal).toFixed(2)
          return variant
        })

        return item
      })

      c.avg_price = (c.avg_price_dollar * currentReal).toFixed(2)
      c.base_currency_calc = currentReal
      c.items = items

      c.save()
    }

    res()
  })
})
