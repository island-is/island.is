import type { GraphQLRequestContext } from 'apollo-server-types'

export const GRAPHQL_CACHE_KEY_PROVIDERS = 'GRAPHQL_CACHE_KEY_PROVIDERS'

export interface GraphqlCacheKeyProvider {
  operationNames: string[]
  getCacheKeyData(requestContext: GraphQLRequestContext): string | Promise<string>
}
