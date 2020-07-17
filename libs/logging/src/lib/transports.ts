import * as Sentry from '@sentry/node'
import * as Transport from 'winston-transport'

export class SentryTransport extends Transport {
  constructor() {
    super({ level: 'error' })
  }

  log(info, callback) {
    // Checks whether sentry has been initialized
    // https://github.com/getsentry/sentry-go/issues/9
    if (Sentry.getCurrentHub()?.getClient()) {
      if (info.extra) {
        Object.keys(info.extra).forEach((key) => {
          Sentry.setExtra(key, info.extra[key])
        })
      }
      Sentry.captureMessage(info.message)
    }
    callback()
  }
}
