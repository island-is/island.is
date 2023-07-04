import express from 'express'
import { collectDefaultMetrics, register } from 'prom-client'
import { logger } from '@island.is/logging'
import { getServerPort } from './getServerPort'

// a separate express app to serve the metrics listening on a different port
export const startMetricServer = (port: number) => {
  collectDefaultMetrics()

  const metricsApp = express()
  metricsApp.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType)
    res.end(register.metrics())
  })

  const server = metricsApp.listen(port, () => {
    logger.info(
      `Metrics listening at http://localhost:${getServerPort(server, port)}`,
    )
  })
  return server
}
