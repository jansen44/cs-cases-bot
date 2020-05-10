require('dotenv').config()

const fs = require('fs')

const DiscordClient = require('./src')

const { openDatabaseConnection, dropCasesCollection } = require('./src/db')
const { updateCurrencies } = require('./src/db/queries/cases')

const { Log } = require('./src/util')
const { populateItems } = require('./src/hexaone')

async function start() {
  try {
    if (!fs.existsSync('cache')) { fs.mkdirSync('cache') }

    Log.info('Checking if database is up...')
    const db_result = await openDatabaseConnection()

    Log.info(db_result)

    if (process.argv.some(arg => arg === '--repopulate')) {
      Log.info('Repopulating database...')
      Log.info('Dropping Cases collection...')
      const drop_result = await dropCasesCollection()

      Log.info(drop_result)

      Log.info('Loading items and prices data')
      await populateItems()
    }

    if (process.argv.some(arg => arg === '--update-currency')) {
      Log.info('Updating prices with currency...')
      await updateCurrencies()
    }

    Log.info('Logging on Discord')
    DiscordClient.login(process.env.BOT_TOKEN)

  } catch (err) {
    Log.error(err)
    process.exit()
  }
}

start()
