import { Application } from 'express'
import * as Sentry from '@sentry/node'

import { environment } from '../environments'

const {
  sentry: { dsn },
} = environment

Sentry.init({ dsn, environment: 'application' })

export const setupRequestHandler = (app: Application) => {
  app.use(Sentry.Handlers.requestHandler())
}

export const setupErrorHandler = (app: Application) => {
  app.use(Sentry.Handlers.errorHandler())
}
