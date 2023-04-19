export const DEFAULT_DOMAIN = '@island.is'

export enum GrantTypeEnum {
  AuthorizationCode = 'authorization_code',
  ClientCredentials = 'client_credentials',
  TokenExchange = 'urn:ietf:params:oauth:grant-type:token-exchange',
}

export enum ClientType {
  native = 'native',
  web = 'web',
  machine = 'machine',
  spa = 'spa',
}

export enum RefreshTokenExpiration {
  /** when refreshing the token, the lifetime of the refresh token will be renewed (by the amount specified in Client.SlidingRefreshTokenLifetime). The lifetime will not exceed Client.AbsoluteRefreshTokenLifetime. */
  Sliding = 'Sliding',

  /** the refresh token will expire on a fixed point in time (specified by the AbsoluteRefreshTokenLifetime). */
  Absolute = 'Absolute',
}
