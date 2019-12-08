module.exports = {
  apps : [{
    name: 'geoapi',
    script: 'dist/index.js',
    instances: parseInt(process.env.WEB_CONCURRENCY || 1)
  }]
}
