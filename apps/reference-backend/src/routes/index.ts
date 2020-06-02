import { Router } from 'express'
import { Applications } from '../app/applications'
import { logger } from '../infra/logging'

export const routes = Router()
const asyncRoute = (route) => (req, res, next = console.error) =>
  Promise.resolve(route(req, res)).catch(next)

routes.get(
  '/resource/:ssn',
  asyncRoute(async (req, res) => {
    const app = new Applications()
    const ssn: string = req.params.ssn
    logger.debug(`SSN is "${ssn}"`)
    const model = await app.getBySsn({ ssn })
    res.status(200).send({ id: model.id })
  }),
)

routes.post(
  '/resource',
  asyncRoute(async (req, res) => {
    const ssn: string = req.body.ssn
    logger.debug(`Creating application with SSN - ${ssn}`)
    const app = new Applications()
    const id = await app.register({ ssn })
    res.status(200).send({ id })
  }),
)
