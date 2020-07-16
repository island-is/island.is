import express from 'express'
import { register } from 'prom-client'
import { logger } from '@island.is/logging'

// a separate express app to serve the metrics listening on a different port
export const runMetricServer = (port: number) => {
  const metricsApp = express()
  metricsApp.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType)
    res.end(register.metrics())
  })

  metricsApp.listen(port, () => {
    logger.info(`Metrics listening at http://localhost:${port}`)
  })
}
