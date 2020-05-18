import { Router } from 'express'
import { Counter } from 'prom-client'

const resourceRequests = new Counter({
  name: 'requests',
  labelNames: ['resource'],
  help: 'Number of resource requests',
})

export const routes = Router()

routes.use('/resourceA', (req, res) => {
  res.status(200).send({ a: 5 })
  resourceRequests.labels('resourceA').inc()
})

routes.use('/resourceB', (req, res) => {
  res.status(200).send({ b: 10 })
  resourceRequests.labels('resourceB').inc()
})
