import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

let apolloClientPromise: Promise<ApolloClient<NormalizedCacheObject>> | null =
  null
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null
let initFn: (() => Promise<ApolloClient<NormalizedCacheObject>>) | null = null

export function setInitializer(
  fn: () => Promise<ApolloClient<NormalizedCacheObject>>,
) {
  initFn = fn
}

export const getApolloClientAsync = () => {
  if (!apolloClientPromise) {
    if (!initFn) {
      throw new Error('Apollo client initializer not set')
    }
    apolloClientPromise = initFn().then((client) => {
      apolloClient = client
      return client
    })
  }
  return apolloClientPromise
}

export const getApolloClient = () => {
  if (!apolloClient) {
    throw new Error('Apollo client not initialized')
  }
  return apolloClient
}
