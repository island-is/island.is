import { RequestHandler } from 'msw'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type RequestHandlersList = RequestHandler<any, any, any, any>[]

const allowedKeyPaths = ['stjornbord', 'minarsidur']

const extractUniqueKeyPath = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    const pathSegments = parsedUrl.pathname
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean)
    return pathSegments.length > 0 ? pathSegments[0] : null
  } catch (error) {
    // noop
    return null
  }
}

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
    const keyPath = extractUniqueKeyPath(location.href)

    if (keyPath && allowedKeyPaths.includes(keyPath)) {
      const normalizedPath = keyPath.endsWith('/') ? keyPath : `${keyPath}/`

      worker.start({
        serviceWorker: {
          url: `/${normalizedPath}mockServiceWorker.js`,
        },
      })
    } else {
      worker.start()
    }
    return worker
  }
}
