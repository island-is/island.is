export interface TokenResponse {
  // ID token issued by the authorization server
  id_token: string

  // Access token used to access protected resources
  access_token: string

  // Time in seconds until the access token expires
  expires_in: number

  // Type of the token issued, typically "Bearer"
  token_type: string

  // Scopes associated with the access token
  scope: string
}

export interface IdTokenData {
  // Issuer
  iss: string

  // Not before (timestamp)
  nbf: number

  // Issued at (timestamp)
  iat: number

  // Expiration time (timestamp)
  exp: number

  // Audience
  aud: string

  // Authentication methods references
  amr: string[]

  // Access token hash
  at_hash: string

  // Session ID
  sid: string

  // Subject identifier
  sub: string

  // Authentication time (timestamp)
  auth_time: number

  // Identity provider
  idp: string

  // Authentication context class reference
  acr: string

  // Subject type (e.g., "person")
  subjectType: string

  // National ID
  nationalId: string

  // Full name
  name: string

  // Gender (e.g., "male")
  gender: string

  // Birthdate in the format YYYY-MM-DD
  birthdate: string

  // Locale (e.g., "is")
  locale: string
}

export type CachedTokenResponse = TokenResponse & {
  userProfile: IdTokenData
  /**
   * Stores the original URL to facilitate user redirection during the `/logout/callback` process.
   * This is necessary because the `/logout/callback` endpoint is invoked by the identity server,
   * meaning we cannot obtain the original URL from the incoming request not does the identity server
   * send query parameters to the callback URL.
   */
  originUrl: string
}
