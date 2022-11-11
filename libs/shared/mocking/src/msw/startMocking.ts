import { RequestHandler } from 'msw'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type RequestHandlersList = RequestHandler<any, any, any, any>[]

export const startMocking = (requestHandlers: RequestHandlersList) => {
  if (typeof window === 'undefined') {
    // https://github.com/webpack/webpack/issues/8826
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupServer } = eval('require')('msw/node')
    const server = setupServer(...requestHandlers)
    server.listen()
    return server
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupWorker } = require('msw')
    const worker = setupWorker(...requestHandlers)
    if (location.pathname.split('/')[1] === 'minarsidur') {
      worker.start({
        serviceWorker: {
          url: '/minarsidur/mockServiceWorker.js',
        },
      })
    } else {
      worker.start()
    }
    return worker
  }
}
