import * as Sentry from '@sentry/node'

import { environment } from '../environments'

const {
  sentry: { dsn },
  ferdalag,
} = environment

Sentry.init({
  dsn,
  environment: 'queue-listener',
  beforeBreadcrumb: (breadCrumb) => {
    // Strip ferdalag apikey from breadcrumb
    if (breadCrumb.data.url.startsWith(ferdalag.url)) {
      const [strippedUrl] = breadCrumb.data.url.split('?')
      return {
        ...breadCrumb,
        data: {
          ...breadCrumb.data,
          url: strippedUrl,
        },
      }
    }
    return breadCrumb
  },
})

export const errorHandler = (error) => {
  Sentry.captureException(error)
}
