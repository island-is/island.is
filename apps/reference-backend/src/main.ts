// This needs to be the first import in the app to hook into the modules system correctly
import '@island.is/infra-tracing'

import express from 'express'
import { collectDefaultMetrics, Histogram } from 'prom-client'
import { routes } from './routes'
import { metricsApp } from './infra/metrics-publisher'
import { logger } from '@island.is/logging'

const app = express()

app.use(express.json())

collectDefaultMetrics()

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
})

// metrics related middleware part 1
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
})

// open areas
app.get('/status', (req, res) => {
  res.json({ ok: true })
})

// version of the code running
app.get('/version', (req, res) => {
  res.json({ version: process.env.REVISION })
})

// security middleware
app.use((req, res, next) => {
  // we need to secure all routes by default. OAuth?
  next()
})

// secured
app.use('/', routes)

// metrics related middleware part 2
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch

  httpRequestDurationMicroseconds
    .labels(req.method, req.path, `${res.statusCode}`)
    .observe(responseTimeInMs)

  next()
})

app.use(function(err, req, res, next) {
  logger.error(`Status code: ${err.status}, msg: ${err.message}`)
  res.status(err.status || 500)
  res.send(err.message)
})

metricsApp.listen(9696, () => {
  console.log(`Metrics listening ...`)
})

const port = process.env.port || 3000
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
server.on('error', console.error)
