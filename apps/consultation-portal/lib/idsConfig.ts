export const identityServerId = 'identity-server'

export const identityServerConfig = {
  id: identityServerId,
  name: 'Samradsgatt',
  scope: 'openid profile @island.is/samradsgatt',
  clientId: '@island.is/samradsgatt',
  domain: 'identity-server.dev01.devland.is',
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`
