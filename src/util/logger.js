const clc = require("cli-color")

module.exports.Log = {
  info: (msg) => console.log(clc.greenBright(`\n## ${msg}`)),
  message: (msg) => {
    console.log(clc.blueBright(`\n-- New Message from ${msg.author.username}(${msg.author.id}):`))
    console.log(clc.blueBright(`-- "${msg.content}"`))
  },
  error: ({ location, err, custom }) => {
    console.log(clc.redBright(`!! Something went wrong on '${location}' method!`))
    err && console.log(clc.redBright(`!! Error Message: ${err.message}`))
    err && err.code && console.log(clc.redBright(`!! Error Code: ${err.code}`))
    custom && console.log(clc.redBright(`!! ${custom}`))
  }
}
