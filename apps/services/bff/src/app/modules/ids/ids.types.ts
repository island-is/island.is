export type GetLoginSearchParamsReturnValue = {
  client_id: string
  redirect_uri: string
  response_type: string
  response_mode: string
  scope: string
  state: string
  code_challenge: string
  code_challenge_method: string
  login_hint?: string
  prompt?: string
}

export interface ErrorResponse {
  // Error code, e.g. invalid_grant, invalid_request, ...
  error: string

  // Human-readable error description,
  error_description: string
}

export type ParResponse = {
  // An identifier for the authorization request, instead of sending the parameters that were just pushed
  request_uri: string

  // Time in seconds until the request_uri expires
  expires_in: number
}

export type TokenResponse = {
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

export interface SuccessResponse<T> {
  type: 'success'
  data: T
}

export interface ErrorRes {
  type: 'error'
  data: ErrorResponse
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorRes

export type LogoutTokenPayload = {
  // Issuer of the token
  iss: string

  // Subject of the token
  sub: string

  // Audience of the token
  aud: string

  // Time when the token was issued
  iat: number

  // Time when the token expires
  exp: number

  // Session ID
  sid: string

  // Unique identifier for the token.
  jti: string
}
