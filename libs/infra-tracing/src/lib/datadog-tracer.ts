import tracer from 'dd-trace'

if (process.env.NODE_ENV !== 'development') {
  tracer.init({ logInjection: true }) // initialized in a different file to avoid hoisting.
  tracer.use('express', { blacklist: ['/liveness', '/readiness', '/metrics'] })
}

export default tracer
