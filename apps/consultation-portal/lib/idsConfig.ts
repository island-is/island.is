export const identityServerId = 'identity-server'

export const identityServerConfig = {
  id: identityServerId,
  name: 'Samradsgatt',
  scope: `openid profile`,
  clientId: '@island.is/samradsgatt',
  domain: '77identity-server.staging01.devland.is',
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`
