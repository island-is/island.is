import express from 'express'
import { register, Counter, collectDefaultMetrics, Histogram } from "prom-client";

const app = express()

app.use(express.json())

collectDefaultMetrics();

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
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

// security middleware
app.use((req, res, next) => {
  // we need to secure all routes by default. OAuth?
  next()
})

// secured
const requests = new Counter({name: 'requests', labelNames: ['resource'], help: 'Number of resource requests'})

app.use('/resourceA', (req, res) => {
  res.status(200).send({ a: 5 })
  requests.labels("resourceA").inc()
})

app.use('/resourceB', (req, res) => {
  res.status(200).send({ b: 10 })
  requests.labels("resourceB").inc()
})


// metrics related middleware part 2
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch

  httpRequestDurationMicroseconds
    .labels(req.method, req.path, `${res.statusCode}`)
    .observe(responseTimeInMs)

  next()
})

// a separate express app to serve the metrics listening on a different port
const metricsApp = express()
metricsApp.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(register.metrics())
})

metricsApp.listen(9696, () => {
  console.log(`Metrics listening ...`)
})

const port = process.env.port || 3000
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
server.on('error', console.error)
