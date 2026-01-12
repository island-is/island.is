export const DEFAULT_DOMAIN = '@island.is'

export enum AcrEnum {
  EidasLoaHigh = 'eidas-loa-high',
  IslandIsPasskey = 'islandis-passkey',
}

export const defaultAcrValue = AcrEnum.EidasLoaHigh

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

export enum ClientSso {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export enum RefreshTokenExpiration {
  /** when refreshing the token, the lifetime of the refresh token will be renewed (by the amount specified in Client.SlidingRefreshTokenLifetime). The lifetime will not exceed Client.AbsoluteRefreshTokenLifetime. */
  Sliding = 'Sliding',

  /** the refresh token will expire on a fixed point in time (specified by the AbsoluteRefreshTokenLifetime). */
  Absolute = 'Absolute',
}

export function translateRefreshTokenExpiration(
  refreshTokenExpiration?: RefreshTokenExpiration,
): number
export function translateRefreshTokenExpiration(
  refreshTokenExpiration?: number,
): RefreshTokenExpiration
export function translateRefreshTokenExpiration(
  refreshTokenExpiration?: RefreshTokenExpiration | number,
): RefreshTokenExpiration | number {
  if (typeof refreshTokenExpiration === 'number') {
    switch (refreshTokenExpiration) {
      case 0:
        return RefreshTokenExpiration.Sliding
      case 1:
      default:
        return RefreshTokenExpiration.Absolute
    }
  } else {
    switch (refreshTokenExpiration) {
      case RefreshTokenExpiration.Sliding:
        return 0
      case RefreshTokenExpiration.Absolute:
      default:
        return 1
    }
  }
}
