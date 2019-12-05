import assert from 'assert'
import net from 'net'
import request from 'request-promise-native'
import Server from './server'

const port = 9999
const [ httpServer, startServer ] = Server(port)

describe('#startServer', function() {
  before(`start server`, async function() {
    await startServer()
  })

  it(`should have started a web server on the specified port`, async function() {
    assert.equal(true, await isPortTaken(port))
  })

  it(`should redirect index route to /me`, async function() {
    const response = await request.get(`http://localhost:${port}`, {
      followRedirect: false,
      resolveWithFullResponse: true,
      simple: false
    })
    assert.equal(302, response.statusCode)
  })

  it(`should successfully pull /me`, async function() {
    const response = await request.get(`http://localhost:${port}/me`, { json: true })
    assert.equal(true, response.hasOwnProperty('ip'))
  })

  it(`should successfully pull /8.8.8.8`, async function() {
    const response = await request.get(`http://localhost:${port}/8.8.8.8`, { json: true })
    assert.equal('8.8.8.8', response.ip)
    assert.equal('US', response.country)
  })
})

// https://gist.github.com/whatl3y/64a08d117b5856c21599b650c4dd69e6
async function isPortTaken(port) {
  return await new Promise((resolve, reject) => {
    const tester = net.createServer()
    tester.once('error', err => {
      if (err.code != 'EADDRINUSE')
        return reject(err)
      resolve(true)
    })
    .once('listening', () => tester.once('close', () => resolve(false)).close())
    .listen(port)
  })
}