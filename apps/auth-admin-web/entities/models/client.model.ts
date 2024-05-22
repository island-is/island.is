import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientGrantType } from './client-grant-type.model'
import { ClientClaim } from './client-claim.model'

export class Client {
  clientId!: string
  nationalId!: string
  clientType!: string
  allowOfflineAccess!: boolean
  identityTokenLifetime!: number
  accessTokenLifetime!: number
  authorizationCodeLifetime!: number
  absoluteRefreshTokenLifetime!: number
  slidingRefreshTokenLifetime!: number
  consentLifetime?: number
  refreshTokenUsage!: number
  updateAccessTokenClaimsOnRefresh!: boolean
  refreshTokenExpiration!: number
  accessTokenType!: number
  enableLocalLogin!: boolean
  includeJwtId!: boolean
  alwaysSendClientClaims!: boolean
  pairWiseSubjectSalt?: string
  userSsoLifetime?: number
  userCodeType?: string
  deviceCodeLifetime!: number
  alwaysIncludeUserClaimsInIdToken!: boolean
  backChannelLogoutSessionRequired!: boolean
  enabled?: boolean
  logoUri?: string
  requireConsent!: boolean
  requirePkce!: boolean
  requireRequestObject!: boolean
  allowPlainTextPkce!: boolean
  allowAccessTokenViaBrowser!: boolean
  frontChannelLogoutUri?: string
  frontChannelLogoutSessionRequired!: boolean
  backChannelLogoutUri?: string
  allowRememberConsent!: boolean
  clientClaimsPrefix?: string
  clientName?: string
  clientUri?: string
  description?: string
  protocolType!: string
  requireClientSecret!: boolean
  archived!: Date
  contactEmail!: string
  supportedDelegationTypes!: string[]
  supportsCustomDelegation!: boolean
  supportsLegalGuardians!: boolean
  supportsPersonalRepresentatives!: boolean
  supportsProcuringHolders!: boolean
  promptDelegations!: boolean
  requireApiScopes!: boolean
  readonly created!: Date
  readonly modified?: Date
  allowedScopes?: ClientAllowedScope[]
  allowedCorsOrigins?: ClientAllowedCorsOrigin[]
  postLogoutRedirectUris?: ClientPostLogoutRedirectUri[]
  redirectUris?: ClientRedirectUri[]
  identityProviderRestrictions?: ClientIdpRestrictions[]
  clientSecrets?: ClientSecret[]
  allowedGrantTypes?: ClientGrantType[]
  claims?: ClientClaim[]
}
