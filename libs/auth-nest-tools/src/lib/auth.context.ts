import { AsyncLocalStorage } from 'async_hooks'
import { Auth } from './auth'

const authContextStorage = new AsyncLocalStorage<Auth>()

/**
 * Provides an async context for authentication information (`auth`) using AsyncLocalStorage.
 *
 * This context is used to store and retrieve the current authentication state (the `Auth` object)
 * throughout the lifetime of an asynchronous operation.
 *
 * The `withAuthContext` function sets the current `auth` context for a callback and its async descendants.
 * The `getAuthContext` function retrieves the current `auth` context from anywhere in the call stack.
 *
 * Usage:
 * - Use `withAuthContext(auth , () => { ... })` at the entry point of a request or operation to set the context.
 * - Use `getAuthContext()` in any function called within that context to access the current `auth` object.
 */

export const withAuthContext = <R, TArgs extends unknown[]>(
  context: Auth,
  callback: (...args: TArgs) => R,
  ...args: TArgs
): R => {
  return authContextStorage.run(context, callback, ...args)
}

export const getAuthContext = (): Auth | null => {
  return authContextStorage.getStore() ?? null
}
