const appName = process.env.APP_NAME || "geoip"

export default {
  app: {
    name: appName
  },

  server: {
    // isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 8080
  },
  
  logger: {
    options: {
      name: appName,
      streams: [
        {
          level: process.env.LOGGING_LEVEL || "info",
          stream: process.stdout
        }
      ]
    }
  }
}
