import { JudicalSystemScope } from '@island.is/auth/scopes'

export const identityServerId = 'identity-server'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token'

export const identityServerConfig = {
  id: identityServerId,
  name: 'Innskráning Ísland.is - Dómsmálaráðuneytið',
  scope: `openid profile ${JudicalSystemScope.read} ${JudicalSystemScope.write} offline_access @rettarvorslugatt.island.is/internal`,
  clientId: '@rettarvorslugatt.island.is/web',
}

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`
