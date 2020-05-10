const mongoose = require('mongoose')

const Cases = new mongoose.Schema({
  name: String,
  icon_url: String,
  avg_price: Number,
  avg_price_dollar: Number,
  base_currency_calc: Number,
  items: [
    {
      name: String,
      color: String,
      rarity: String,
      icon_url: String,
      variants: [
        {
          name: String,
          tags: [
            {
              category: String,
              category_name: String,
              internal_name: String,
              color: String,
              name: String
            }
          ],
          icon_url: String,
          avg_price_dollar: Number,
          avg_price: Number
        }
      ]
    }
  ]
}, { versionKey: false })

module.exports.Cases = mongoose.model('Cases', Cases)
