import http from 'http'
import express from 'express'
import cors from 'cors'
import bunyan from 'bunyan'
import geoip from 'geoip-lite'
import config from './config'

const log = bunyan.createLogger(config.logger.options)
const app = express()
const server = http.Server(app)

app.disable('x-powered-by')

export default function WebServer(portToListenOn=config.server.port) {
  return [
    server,
    async function startServer() {
      return await new Promise(resolve => {
        try {
          // https://expressjs.com/en/guide/behind-proxies.html
          app.set('trust proxy', 1)
          app.use(cors())
  
          app.get('/me', function meRoute(req, res) {
            // https://devcenter.heroku.com/articles/http-routing#heroku-headers
            const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || "").split(',')
            const ip = realClientIpAddress[realClientIpAddress.length - 1]
            res.json({ ip, ...geoip.lookup(ip) })
          })
  
          app.get('/:ip', function ipRoute(req, res) {
            res.json({ ip: req.params.ip, ...geoip.lookup(req.params.ip) })
          })

          app.all('*', function fallbackRoute(req, res) {
            res.redirect('/me')
          })
  
          app.use(function expressErrorHandler(err, req, res, next) {
            log.error('Express error handling', err)
            res.sendStatus(500)
          })
  
          server.listen(portToListenOn, () => {
            log.info(`listening on *: ${portToListenOn}`)
            resolve()
          })

          return app
  
        } catch(err) {
          log.error("Error starting server", err)
          process.exit()
        }
      })
    }
  ]
}
