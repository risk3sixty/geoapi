import Server from './server'

const [ , startServer ] = Server()

;(async function() {
  await startServer()
})()