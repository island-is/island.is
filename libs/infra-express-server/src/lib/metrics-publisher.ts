import express from 'express'
import { register } from 'prom-client'

// a separate express app to serve the metrics listening on a different port
export const metricsApp = express()
metricsApp.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(register.metrics())
})
