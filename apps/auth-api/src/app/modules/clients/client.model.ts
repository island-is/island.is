import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientGrantType } from './client-grant-type.model'

@Table({
  tableName: 'client',
  indexes: [
    {
      fields: ['client_id'],
    },
  ],
})
export class Client extends Model<Client> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  clientId: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  allowOfflineAccess: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  identityTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  accessTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  authorizationCodeLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  absoluteRefreshTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  slidingRefreshTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  consentLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  refreshTokenUsage: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  updateAccessTokenClaimsOnRefresh: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  refreshTokenExpiration: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  accessTokenType: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  enableLocalLogin: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  includeJwtId: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  alwaysSendClientClaims: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  pairWiseSubjectSalt: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  userSsoLifetime: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  userCodeType: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  deviceCodeLifetime: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  alwaysIncludeUserClaimsInIdToken: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  backChannelLogoutSessionRequired: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  enabled: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  logoUri: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  requireConsent: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  requirePkce: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  allowPlainTextPkce: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  allowAccessTokenViaBrowser: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  frontChannelLogoutUri: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  frontChannelLogoutSessionRequired: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  backChannelLogoutUri: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  allowRememberConsent: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  clientClaimsPrefix: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  clientName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  clientUri: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  description: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  protocolType: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  requireClientSecret: boolean

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date

  @HasMany(() => ClientAllowedScope)
  @ApiProperty()
  readonly allowedScopes: ClientAllowedScope[]

  @HasMany(() => ClientAllowedCorsOrigin)
  @ApiProperty()
  readonly allowedCorsOrigin: ClientAllowedCorsOrigin[]

  @HasMany(() => ClientPostLogoutRedirectUri)
  @ApiProperty()
  readonly postLogoutRedirectUri

  @HasMany( () => ClientRedirectUri)
  readonly redirectUris: ClientRedirectUri

  @HasMany( () => ClientIdpRestrictions)
  readonly identityProviderRestrictions: ClientIdpRestrictions

  @HasMany( () => ClientSecret)
  readonly clientSecrets: ClientSecret

  @HasMany( () => ClientGrantType )
  readonly allowedGrantTypes
}
