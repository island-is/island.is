// This needs to be the first import in the app to hook into the modules system correctly
import { initTracing } from '@island.is/infra-tracing'

import express, { Router } from 'express'
import { collectDefaultMetrics, Histogram } from 'prom-client'
import { metricsApp } from './metrics-publisher'
import { logger } from '@island.is/logging'

type RunServerParams = {
  routes: Router
  name: string
  public?: Router
}

export const runServer = (opts: RunServerParams) => {
  const app = express()
  initTracing(opts.name)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  collectDefaultMetrics()

  const httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
  })

  app.use(function collectRouteMetricsPart1(req, res, next) {
    res.locals.startEpoch = Date.now()
    res.on('finish', function () {
      const responseTimeInMs = Date.now() - res.locals.startEpoch
      httpRequestDurationMicroseconds
        .labels(req.method, req.path, `${res.statusCode}`)
        .observe(responseTimeInMs)
      })
    return next()
  })

  app.get('/liveness', function liveness(req, res) {
    res.json({ ok: true })
  })

  app.get('/version', function versionOfCode(req, res) {
    res.json({ version: process.env.REVISION })
  })

  // additional public routes
  if (opts.public) {
    app.use('/public', opts.public)
  }

  // security middleware
  // we should implemente something along the lines of this https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
  app.use((req, res, next) => {
    // we need to secure all routes by default. OAuth?
    next()
  })

  // secured
  app.use('/', opts.routes)

  app.use(function errorHandler(err, req, res, next) {
    logger.error(`Status code: ${err.status}, msg: ${err.message}`)
    res.status(err.status || 500)
    res.send(err.message)
  })

  const servicePort = parseInt(process.env.port || '3000')
  const metricsPort = servicePort + 1
  metricsApp.listen(metricsPort, () => {
    logger.info(`Metrics listening on port ${metricsPort}`)
  })

  const server = app.listen(servicePort, () => {
    logger.info(`Listening on port ${servicePort}`)
  })
  server.on('error', logger.error)
  return server
}
