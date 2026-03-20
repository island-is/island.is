import type { GraphQLRequestContext } from 'apollo-server-types'

export const GRAPHQL_CACHE_KEY_PROVIDERS = 'GRAPHQL_CACHE_KEY_PROVIDERS'

export interface GraphqlCacheKeyProvider {
  operationNames: string[]
  /**
   * Optional regex patterns matched against the query body.
   * This catches anonymous or renamed operations that resolve the same fields.
   */
  queryPatterns?: RegExp[]
  getCacheKeyData(requestContext: GraphQLRequestContext): string | Promise<string>
}

/**
 * Returns true when the request matches a provider by operation name or query body.
 */
export function matchesCacheKeyProvider(
  provider: GraphqlCacheKeyProvider,
  operationName: string,
  query: string,
): boolean {
  return (
    provider.operationNames.includes(operationName) ||
    provider.queryPatterns?.some((r) => r.test(query)) === true
  )
}
