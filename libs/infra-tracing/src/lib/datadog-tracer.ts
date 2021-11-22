import tracer from 'dd-trace'
import { isPerson } from 'kennitala'
import { Span } from 'opentracing'

if (process.env.NODE_ENV !== 'development') {
  const rewriteUrl = (url: string): string =>
    url
      .split('/')
      .map((segm) => (isPerson(segm) ? '--MASKED--' : segm))
      .join('/')
  const shouldMask = (statusCode?: number): boolean =>
    !statusCode || statusCode < 400
  const maskSpan = (span: Span, url: string, statusCode?: number): void => {
    // Leaving here for future reference - an "ok" way to debug dd traces locally
    // span?.setTag('test_tag', 'your-unique-test-tag')
    if (shouldMask(statusCode)) {
      span?.setTag('http.url', rewriteUrl(url))
    }
  }
  tracer.init({ logInjection: true }) // initialized in a different file to avoid hoisting.
  tracer.use('express', {
    blacklist: ['/liveness', '/readiness', '/metrics'],
    hooks: {
      request: (span, req, res) => {
        span &&
          req?.url &&
          maskSpan(span, req.url, res?.statusCode || req?.statusCode)
      },
    },
  })
  tracer.use('http', {
    client: {
      hooks: {
        request: (span, req, res) => {
          const url =
            res?.url ||
            `${req?.protocol}//${req?.getHeader('host')}${req?.path}`
          span && maskSpan(span, url, res?.statusCode)
        },
      },
    },
  })
}

export default tracer
