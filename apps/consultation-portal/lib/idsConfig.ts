import env from './environment'

export const identityServerConfig = {
  id: env.identityServerId,
  name: env.identityServerName,
  scope: env.identityServerScope,
  clientId: env.identityServerClientId,
  domain: env.identityServerDomain,
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`
