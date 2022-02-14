import { environment } from './environment/environment'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  environment.idsCookieName

export const identityServerId = 'identity-server'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope: `openid profile @samband.is/internal offline_access @skra.is/individuals ${MunicipalitiesFinancialAidScope.read} ${MunicipalitiesFinancialAidScope.write}`,
  clientId: '@samband.is/financial-aid',
}
