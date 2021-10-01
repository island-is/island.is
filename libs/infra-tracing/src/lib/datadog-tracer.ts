import tracer from 'dd-trace'
import { isPerson } from 'kennitala'

if (process.env.NODE_ENV !== 'development') {
  tracer.init({ logInjection: true }) // initialized in a different file to avoid hoisting.
  tracer.use('express', { blacklist: ['/liveness', '/readiness', '/metrics'] })
  tracer.use('http', {
    client: {
      hooks: {
        request: (span, req, res) => {
          const url =
            res?.url || `http(s)://${req?.getHeader('host')}${req?.path}`
          const urlRewritten = url
            .split('/')
            .map((segm) => (isPerson(segm) ? '--MASKED--' : segm))
            .join('/')
          span?.setTag('http.url', urlRewritten)
        },
      },
    },
  })
}

export default tracer
