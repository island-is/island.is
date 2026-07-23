import { getClientRuntimeEnv, isServerSide } from '@island.is/next/utils'

const graphqlPath = '/api/graphql'

/**
 * Runtime environment config (build-once/deploy-everywhere): values are
 * resolved from process.env at request time on the server, and on the client
 * they are read from the JSON script tag rendered by pages/_document.tsx.
 */

export type PublicRuntimeEnv = ReturnType<typeof buildPublicRuntimeEnv>

/**
 * Values safe to expose to the browser. Only called server-side;
 * the client receives the result via _document.tsx.
 */
export const buildPublicRuntimeEnv = () => ({
  graphqlEndpoint: graphqlPath,
})

/**
 * Isomorphic access to the public runtime environment.
 */
export const getPublicRuntimeEnv = (): PublicRuntimeEnv =>
  isServerSide()
    ? buildPublicRuntimeEnv()
    : (getClientRuntimeEnv() as PublicRuntimeEnv)

/**
 * Server-only values. Never serialized to the client.
 */
export const getServerRuntimeEnv = () => {
  if (!isServerSide()) {
    throw new Error('getServerRuntimeEnv is server-side only')
  }

  const { API_URL = 'http://localhost:3339' } = process.env

  return {
    graphqlEndpoint: `${API_URL}${graphqlPath}`,
  }
}
