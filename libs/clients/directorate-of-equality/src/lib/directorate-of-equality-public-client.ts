import { createClient, createConfig } from '../../gen/fetch/client'
import type { ClientOptions } from '../../gen/fetch'

/**
 * Separate client instance for endpoints that carry no citizen auth
 * (e.g. public aggregate statistics). The default `client` in
 * directorate-of-equality.module.ts is configured with authSource:
 * 'context' + tokenExchange, which throws when there is no logged-in
 * user in context — unusable from an unauthenticated caller.
 */
export const publicClient = createClient(createConfig<ClientOptions>())
