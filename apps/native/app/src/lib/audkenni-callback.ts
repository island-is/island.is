import { bundleId, getConfig } from '../config'

export const getAudkenniCallbackUrl = (sessionId: string) => {
  // Use the bundle ID as the scheme (is.island.app or is.island.app.dev)
  // The path should be different from OAuth to avoid conflicts
  return `${bundleId}://auth/audkenni-callback?sessionId=${sessionId}`
}
