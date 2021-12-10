export const identityServerId = 'identity-server'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope:
    'openid profile @vegagerdin.is/air-discount-scheme-scope @vegagerdin.is/air-discount-scheme-scope:admin offline_access @skra.is/individuals',
  clientId: '@vegagerdin.is/air-discount-scheme',
}
