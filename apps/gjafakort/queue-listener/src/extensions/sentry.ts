import * as Sentry from '@sentry/node'

import { environment } from '../environments'

const {
  sentry: { dsn },
} = environment

Sentry.init({
  dsn,
  environment: 'queue-listener',
})

export const errorHandler = (error) => {
  Sentry.captureException(error)
}
