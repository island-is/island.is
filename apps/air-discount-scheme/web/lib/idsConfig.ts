export const identityServerId = 'identity-server'

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope:
  'openid profile @skra.is/individuals @vegagerdin.is/air-discount-scheme-scope',
  clientId: '@vegagerdin.is/air-discount-scheme',
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`