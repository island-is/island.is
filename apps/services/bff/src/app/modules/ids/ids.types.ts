export type ParResponse = {
  // An identifier for the authorization request, instead of sending the parameters that were just pushed
  request_uri: string

  // Time in seconds until the request_uri expires
  expires_in: number
}

export interface TokenResponse {
  // ID token issued by the authorization server
  id_token: string

  // Access token used to access protected resources
  access_token: string

  // Time in seconds until the access token expires
  expires_in: number

  // Type of the token issued, typically "Bearer"
  token_type: string

  // Refresh token used to obtain a new access token
  refresh_token: string

  // Scopes associated with the access token
  scope: string
}