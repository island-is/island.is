import { Request, Response } from 'express'
import { Histogram } from 'prom-client'

export const httpRequestDurationMiddleware = () => {
  const httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
  })

  return (req: Request, res: Response, next: Function) => {
    res.locals.startEpoch = Date.now()
    res.on('finish', () => {
      const responseTimeInMs = Date.now() - res.locals.startEpoch
      httpRequestDurationMicroseconds
        .labels(req.method, req.path, `${res.statusCode}`)
        .observe(responseTimeInMs)
    })
    return next()
  }
}
