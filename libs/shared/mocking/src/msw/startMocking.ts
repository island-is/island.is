import { RequestHandler } from 'msw'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type RequestHandlersList = RequestHandler<any, any, any, any>[]

export const startMocking = (requestHandlers: RequestHandlersList) => {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupServer } = require('msw/node')
    const server = setupServer(...requestHandlers)
    server.listen()
    return server
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupWorker } = require('msw')
    const worker = setupWorker(...requestHandlers)
    worker.start()
    return worker
  }
}
