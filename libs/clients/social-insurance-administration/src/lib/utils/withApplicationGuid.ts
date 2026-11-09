import { AsyncLocalStorage } from 'async_hooks'
import type { Middleware } from '../../../gen/fetch/v1'

export const APPLICATION_GUID_HEADER = 'X-Island-is-Application-Guid'

const applicationGuidStorage = new AsyncLocalStorage<string>()

/**
 * Makes every request to SÍ made inside the callback carry the island.is
 * application id, without having to pass it down through each client method.
 * Runs the callback as is when there is no application id.
 */
export const withApplicationGuidContext = <R>(
  applicationGuid: string | null | undefined,
  callback: () => R,
): R =>
  applicationGuid
    ? applicationGuidStorage.run(applicationGuid, callback)
    : callback()

/** Reads the application id from the surrounding context, if there is one. */
export const applicationGuidMiddleware: Middleware = {
  pre: async (context) => {
    const applicationGuid = applicationGuidStorage.getStore()

    if (applicationGuid) {
      context.init.headers = {
        ...context.init.headers,
        [APPLICATION_GUID_HEADER]: applicationGuid,
      }
    }
  },
}
