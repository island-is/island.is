if (process.env.NODE_ENV === 'development' && process.env.API_MOCKS) {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { server } = require('./server')
    server.listen()
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('./browser')
    worker.start()
  }
}

// We need some ES6 hint for typescript's `isolatedModules` option.
export const hello = 'world'
