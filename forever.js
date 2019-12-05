const forever = require('forever-monitor')

const times = 10
const child = new (forever.Monitor)('./index.js', {
  max: times,
  silent: false,
  args: []
})

child.on('exit', () => console.log(`geoip has exited after ${times} restarts`))
child.start()
