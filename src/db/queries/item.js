const { Cases } = require('../schemas/cases')

module.exports.getSkinInfo = args => new Promise((res, rej) => {
  Cases.find({ 'items.name': args[0] }, (err, cases) => {
    if (err) { rej({ location: 'getSkinInfo', err }) }

    if (!cases || cases.length === 0) { return res({ item: null, cases: [] }) }

    let _item = null

    const variants = cases.reduce((cs, current) => {
      cs.push(...current.items.find(item => {
        if (item.name === args[0]) {
          if (!_item) { _item = item }
          return true
        }
      }).variants)

      return cs.filter((value, index, self) => self.findIndex(item => item.name === value.name) === index)
    }, [])

    _item.variants = variants.sort((a, b) => a.avg_price - b.avg_price)

    res({
      item: _item,
      cases: cases.map(c => ({ name: c.name, avg_price: c.avg_price }))
    })
  })
})

module.exports.getVariantListInfo = variantList => new Promise((res, rej) => {
  if (!variantList || !Array.isArray(variantList) || variantList.length === 0) {
    return res([])
  }

  const conditionals = variantList.map(v => ({ 'items.variants.name': v }))

  Cases.find({ '$or': conditionals }, (err, cases) => {
    if (err) { rej({ location: 'getVariantListInfo', err }) }

    const variants = cases.reduce((cs, c) => {
      const items = c.items.reduce((items, item) =>
        [
          ...items,
          ...item.variants
            .filter(v => variantList.includes(v.name))
            .map(v => ({
              avg_price: v.avg_price, name: v.name,
              icon_url: v.icon_url, color: item.color,
              amount: (() => {
                let total = 0
                variantList.forEach(_v => { if (v.name === _v) { total++ } })
                return total
              })()
            }))
        ], [])
      return [...cs, ...items]
    }, [])
      .filter((item, index, self) => self.findIndex(i => i.name === item.name) === index)
      .sort((a, b) => a.avg_price - b.avg_price)

    res(variants)
  })
})
