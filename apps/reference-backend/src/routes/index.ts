import { Router } from 'express'
import { Counter } from 'prom-client'
import { SampleApp } from '../app/data'

const resourceRequests = new Counter({
  name: 'requests',
  labelNames: ['resource'],
  help: 'Number of resource requests',
})

export const routes = Router()

routes.get('/resourceA', (req, res) => {
  res.status(200).send({ a: 5 })
  resourceRequests.labels('resourceA').inc()
})

routes.post('/resourceB', async (req, res) => {
  await SampleApp.create({ ssn: '1111111111' })
  res.status(200).send({ b: 10 })
  resourceRequests.labels('resourceB').inc()
})
