import { RequestHandler } from 'msw'

export const startMocking = (requestHandlers: RequestHandler<any,any,any,any,any>[]) => {
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
