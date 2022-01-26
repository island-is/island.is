import { environment } from './environment/environment'
import {
  MunicipalitiesFinancialAidScope,
  NationalRegistryScope,
} from '@island.is/auth/scopes'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  environment.idsCookieName

export const identityServerId = 'identity-server'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope: `openid profile offline_access ${MunicipalitiesFinancialAidScope.read} ${MunicipalitiesFinancialAidScope.write} ${NationalRegistryScope.individuals} @samband.is/internal`,
  clientId: '@samband.is/financial-aid',
}
