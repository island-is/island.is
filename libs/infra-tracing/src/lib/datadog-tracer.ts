import tracer from 'dd-trace'
import { isPerson } from 'kennitala'
import { logger } from '@island.is/logging'

if (process.env.NODE_ENV !== 'development') {
  tracer.init({ logInjection: true }) // initialized in a different file to avoid hoisting.
  tracer.use('express', { blacklist: ['/liveness', '/readiness', '/metrics'] })
  tracer.use('http', {
    client: {
      hooks: {
        request: (span, req, res) => {
          logger.info(`HTTP Tracer: Got span with response url: ${res?.url}`)
          const url = res?.url
          if (url) {
            const urlRewritten = url
              .split('/')
              .map((segm) =>
                isPerson(segm) && segm.length === 10 ? '--MASKED--' : segm,
              )
              .join('/')
            span?.setTag('http.url', urlRewritten)
          }
        },
      },
    },
  })
}

export default tracer
