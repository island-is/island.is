import * as Sentry from '@sentry/node'
// @ts-ignore The problem is that winston-transport defines the export of TransportStream via `export =`
import TransportStream = require('winston-transport')

export class SentryTransport extends TransportStream {
  constructor() {
    super({ level: 'error' })
  }

  log(info: Record<string, string>, callback: () => void) {
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
