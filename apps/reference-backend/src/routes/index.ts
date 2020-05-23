import { Router } from 'express'
import { Applications } from '../app/applications'
import { logger } from '../infra/logging'

export const routes = Router()

routes.get('/resourceA', (req, res) => {
  logger.debug(`Got it`);
  res.status(200).send({ a: 5 })
})

routes.post('/resourceB', async (req, res) => {
  const app = new Applications()
  await app.register({ ssn: '1111111111' })
  res.status(200).send({ b: 10 })
})
