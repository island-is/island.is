export abstract class ClientBaseDTO {
  constructor() {
    this.nationalId = ''
    this.clientType = ''
    this.allowOfflineAccess = false
    this.identityTokenLifetime = 3600
    this.accessTokenLifetime = 3600
    this.authorizationCodeLifetime = 300
    this.absoluteRefreshTokenLifetime = 2592000
    this.slidingRefreshTokenLifetime = 1296000
    this.consentLifetime = null
    this.refreshTokenUsage = 1
    this.updateAccessTokenClaimsOnRefresh = true
    this.refreshTokenExpiration = 0
    this.accessTokenType = 0
    this.enableLocalLogin = true
    this.includeJwtId = true
    this.alwaysSendClientClaims = false
    this.pairWiseSubjectSalt = null
    this.userSsoLifetime = null
    this.userCodeType = null
    this.deviceCodeLifetime = 300
    this.alwaysIncludeUserClaimsInIdToken = false
    this.backChannelLogoutSessionRequired = true
    this.enabled = true
    this.logoUri = null
    this.requireConsent = false
    this.requirePkce = false
    this.allowPlainTextPkce = false
    this.allowAccessTokenViaBrowser = false
    this.frontChannelLogoutUri = null
    this.frontChannelLogoutSessionRequired = true
    this.backChannelLogoutUri = null
    this.allowRememberConsent = true
    this.clientClaimsPrefix = 'client__'
    this.clientName = null
    this.clientUri = null
    this.description = null
    this.protocolType = ''
    this.requireClientSecret = true
    this.contactEmail = ''
    this.supportsCustomDelegation = false
    this.promptDelegations = false
    this.supportsLegalGuardians = false
    this.supportsProcuringHolders = false
    this.supportsPersonalRepresentatives = false
    this.requireApiScopes = false
    this.supportedDelegationTypes = []
  }

  nationalId: string
  clientType: string
  allowOfflineAccess: boolean
  identityTokenLifetime: number
  accessTokenLifetime: number
  authorizationCodeLifetime: number
  absoluteRefreshTokenLifetime: number
  slidingRefreshTokenLifetime: number
  consentLifetime: number | null
  refreshTokenUsage: number
  updateAccessTokenClaimsOnRefresh: boolean
  refreshTokenExpiration: number
  accessTokenType: number
  enableLocalLogin: boolean
  includeJwtId: boolean
  alwaysSendClientClaims: boolean
  pairWiseSubjectSalt: string | null
  userSsoLifetime: number | null
  userCodeType: string | null
  deviceCodeLifetime: number
  alwaysIncludeUserClaimsInIdToken: boolean
  backChannelLogoutSessionRequired: boolean
  enabled: boolean
  logoUri: string | null
  requireConsent: boolean
  requirePkce: boolean
  allowPlainTextPkce: boolean
  allowAccessTokenViaBrowser: boolean
  frontChannelLogoutUri: string | null
  frontChannelLogoutSessionRequired: boolean
  backChannelLogoutUri: string | null
  allowRememberConsent: boolean
  clientClaimsPrefix?: string
  clientName?: string
  clientUri: string | null
  description: string | null
  protocolType: string
  requireClientSecret: boolean
  contactEmail: string
  supportsCustomDelegation!: boolean
  supportsLegalGuardians!: boolean
  supportsProcuringHolders!: boolean
  supportsPersonalRepresentatives!: boolean
  promptDelegations!: boolean
  requireApiScopes!: boolean
  domainName?: string
  supportedDelegationTypes: string[]
}
