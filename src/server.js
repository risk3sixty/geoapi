import http from 'http'
import express from 'express'
import bunyan from 'bunyan'
import geoip from 'geoip-lite'
import config from './config'

const log         = bunyan.createLogger(config.logger.options)
const app         = express()
const httpServer  = http.Server(app)

app.disable('x-powered-by')

export default function WebServer(portToListenOn=config.server.port) {
  return [
    httpServer,
    async function startServer() {
      return await new Promise((resolve, reject) => {
        try {
          // https://expressjs.com/en/guide/behind-proxies.html
          app.set('trust proxy', 1)
  
          app.get('/', function indexRoute(req, res) {
            res.redirect('/me')
          })
  
          app.get('/me', function meRoute(req, res) {
            // https://devcenter.heroku.com/articles/http-routing#heroku-headers
            const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || socket.handshake.address || "").split(',')
            const ip = realClientIpAddress[realClientIpAddress.length - 1]
            res.json({ ip, ...geoip.lookup(ip) })
          })
  
          app.get('/:ip', function ipRoute(req, res) {
            res.json({ ip: req.params.ip, ...geoip.lookup(req.params.ip) })
          })
  
          // Express error handling
          app.use(function ExpressErrorHandler(err, req, res, next) {
            log.error('Express error handling', err)
            res.redirect(err.redirectRoute || '/')
          })
  
          httpServer.listen(portToListenOn, () => {
            log.info(`listening on *: ${portToListenOn}`)
            resolve()
          })
  
        } catch(err) {
          log.error("Error starting server", err)
          reject()
          process.exit()
        } finally {
  
          //handle if the process suddenly stops
          process.on('SIGINT', () => { console.log('got SIGINT....'); process.exit() })
          process.on('SIGTERM', () => { console.log('got SIGTERM....'); process.exit() })
  
          return app
        }
      })
    }
  ]
}
