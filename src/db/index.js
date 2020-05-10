const mongoose = require('mongoose')

module.exports.openDatabaseConnection = () => new Promise((res, rej) => {
  mongoose.connect(process.env.MONGO_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => res('Database Up and Running!'))
    .catch(error => {
      rej({ location: 'testDatabaseConnection', err: error })
    })
})

module.exports.dropCasesCollection = () => new Promise((res, rej) => {
  mongoose.connection.db.dropCollection('cases')
    .then(() => res('Cases collection dropped!'))
    .catch(error => {
      // 26 => collection not found
      if (error.code === 26) { res('Collection not found! Perhaps it\'s already dropped?') }

      rej({ location: 'testDatabaseConnection', err: error })
    })
})
