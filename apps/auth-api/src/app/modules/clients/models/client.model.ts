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
  @ApiProperty({
    example: 'set_client_id',
  })
  clientId: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowOfflineAccess: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  identityTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3600,
  })
  @ApiProperty({
    example: 3600,
  })
  accessTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  authorizationCodeLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 2592000,
  })
  @ApiProperty({
    example: 2592000,
  })
  absoluteRefreshTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1296000,
  })
  @ApiProperty({
    example: 1296000,
  })
  slidingRefreshTokenLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  consentLifetime: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  @ApiProperty({
    example: 1,
  })
  refreshTokenUsage: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  updateAccessTokenClaimsOnRefresh: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty({
    example: false,
  })
  refreshTokenExpiration: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty({
    example: 0,
  })
  accessTokenType: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  enableLocalLogin: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  includeJwtId: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  alwaysSendClientClaims: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  pairWiseSubjectSalt: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  userSsoLifetime: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  userCodeType: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  deviceCodeLifetime: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  alwaysIncludeUserClaimsInIdToken: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  backChannelLogoutSessionRequired: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  enabled: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  logoUri: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  requireConsent: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  requirePkce: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowPlainTextPkce: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowAccessTokenViaBrowser: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  frontChannelLogoutUri: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  frontChannelLogoutSessionRequired: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  backChannelLogoutUri: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  allowRememberConsent: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'set_client_claims_prefix',
  })
  clientClaimsPrefix: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  clientName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  clientUri: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  description: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'set_protocol_type',
  })
  protocolType: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
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

  @HasMany(() => ClientRedirectUri)
  readonly redirectUris: ClientRedirectUri

  @HasMany(() => ClientIdpRestrictions)
  readonly identityProviderRestrictions: ClientIdpRestrictions

  @HasMany(() => ClientSecret)
  readonly clientSecrets: ClientSecret

  @HasMany( () => ClientGrantType )
  readonly allowedGrantTypes
}
