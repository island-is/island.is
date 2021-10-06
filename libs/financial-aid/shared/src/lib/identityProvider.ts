import { environment } from './environment/environment'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  environment.idsCookieName

export const identityServerId = 'identity-server'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope: 'openid profile @island.is/samband/userinfo',
  clientId: '@samband_islenskra_sveitarfelaga/fjarhagur',
}
