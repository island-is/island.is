import { AsyncLocalStorage } from 'async_hooks'
import { format } from 'winston'

const loggingContextStorage = new AsyncLocalStorage<Record<string, unknown>>()

/**
 * Adds context which will be included with all logging inside the callback.
 */
export const withLoggingContext = <R, TArgs extends unknown[]>(
  context: Record<string, unknown>,
  callback: (...args: TArgs) => R,
  ...args: TArgs
): R => {
  const extendedContext = {
    ...loggingContextStorage.getStore(),
    ...context,
  }
  return loggingContextStorage.run(extendedContext, callback, ...args)
}

export const includeContextFormatter = format((info) => {
  const defaultCodeOwner = process.env.CODE_OWNER
  const context = loggingContextStorage.getStore()

  if (defaultCodeOwner) {
    info.codeOwner = defaultCodeOwner
  }
  if (context) {
    Object.assign(info, context)
  }
  return info
})
