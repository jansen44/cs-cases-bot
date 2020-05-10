const handlers = {
  ...require('./user'),
  ...require('./cases'),
  ...require('./item')
}

module.exports = {
  ...handlers,
  cs_help: {
    description: 'Mostra lista de comandos disponíveis.',
    action: (msg) => {
      msg.channel.send({
        embed: {
          color: '#0099ff',
          title: 'Lista de comandos disponíveis: ',
          fields: [
            {
              name: 'cs_help',
              value: 'Mostra essa mensagem',
            },
            ...Object.keys(handlers).map(handler => ({
              name: handler,
              value: handlers[handler].description,
              inline: handlers[handler].inline
            }))
          ]
        }
      })
    }
  }
}
