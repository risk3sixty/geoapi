import startServer from './server'

;(async function() {
  try {
    await startServer()
  } catch(err) {
    process.exit()
  }
})()