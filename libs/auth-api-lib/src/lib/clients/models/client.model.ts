import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript'

import { defaultAcrValue } from '../../types'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientGrantType } from './client-grant-type.model'
import { ClientClaim } from './client-claim.model'
import { Domain } from '../../resources/models/domain.model'
import { ClientDelegationType } from './client-delegation-type.model'
import { DelegationTypeModel } from '../../delegations/models/delegation-type.model'

@Table({
  tableName: 'client',
})
export class Client extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'client_id',
  })
  clientId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: '1234567890',
  })
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'spa',
  })
  clientType!: string

  @ForeignKey(() => Domain)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  domainName?: string

  @BelongsTo(() => Domain)
  domain?: Domain

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowOfflineAccess!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  identityTokenLifetime!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3600,
  })
  @ApiProperty({
    example: 3600,
  })
  accessTokenLifetime!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  authorizationCodeLifetime!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 2592000,
  })
  @ApiProperty({
    example: 2592000,
  })
  absoluteRefreshTokenLifetime!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1296000,
  })
  @ApiProperty({
    example: 1296000,
  })
  slidingRefreshTokenLifetime!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  consentLifetime?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  @ApiProperty({
    example: 1,
  })
  refreshTokenUsage!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  updateAccessTokenClaimsOnRefresh!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  @ApiProperty({
    example: 1,
  })
  refreshTokenExpiration!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty({
    example: 0,
  })
  accessTokenType!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  enableLocalLogin!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  includeJwtId!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  alwaysSendClientClaims!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  pairWiseSubjectSalt?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  userSsoLifetime?: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  userCodeType?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 300,
  })
  @ApiProperty({
    example: 300,
  })
  deviceCodeLifetime!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  alwaysIncludeUserClaimsInIdToken!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  backChannelLogoutSessionRequired!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  enabled?: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  logoUri?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  requireConsent!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: false,
  })
  requirePkce!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  requireRequestObject!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowPlainTextPkce!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: false,
  })
  allowAccessTokenViaBrowser!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  frontChannelLogoutUri?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  frontChannelLogoutSessionRequired!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  backChannelLogoutUri?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  allowRememberConsent!: boolean

  @Column({
    type: DataType.STRING,
    defaultValue: 'client_',
  })
  @ApiProperty({
    example: 'client_claims_prefix',
  })
  clientClaimsPrefix!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  clientName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: null,
  })
  clientUri?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    example: 'Client Description for AdminUI',
  })
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'oidc',
  })
  @ApiProperty({
    example: 'protocol_type',
  })
  protocolType!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({
    example: true,
  })
  requireClientSecret!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({
    example: null,
  })
  archived!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty({
    example: null,
  })
  contactEmail!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  supportsCustomDelegation!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  supportsLegalGuardians!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  supportsProcuringHolders!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  supportsPersonalRepresentatives!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  promptDelegations!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  requireApiScopes!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({
    example: true,
  })
  singleSession!: boolean

  @Column({
    type: DataType.ENUM('enabled', 'disabled'),
    allowNull: false,
  })
  @ApiProperty({
    example: 'disabled',
  })
  sso!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @HasMany(() => ClientAllowedScope)
  @ApiProperty()
  allowedScopes?: ClientAllowedScope[]

  @HasMany(() => ClientAllowedCorsOrigin)
  @ApiProperty()
  allowedCorsOrigins?: ClientAllowedCorsOrigin[]

  @HasMany(() => ClientPostLogoutRedirectUri)
  @ApiProperty()
  postLogoutRedirectUris?: ClientPostLogoutRedirectUri[]

  @HasMany(() => ClientRedirectUri)
  redirectUris?: ClientRedirectUri[]

  @HasMany(() => ClientIdpRestrictions)
  identityProviderRestrictions?: ClientIdpRestrictions[]

  @HasMany(() => ClientSecret)
  clientSecrets?: ClientSecret[]

  @HasMany(() => ClientGrantType)
  allowedGrantTypes?: ClientGrantType[]

  @HasMany(() => ClientClaim)
  claims?: ClientClaim[]

  @HasMany(() => ClientDelegationType)
  supportedDelegationTypes?: ClientDelegationType[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [defaultAcrValue],
  })
  @ApiProperty()
  allowedAcr!: string[]

  @BelongsToMany(() => DelegationTypeModel, () => ClientDelegationType)
  delegationTypes?: DelegationTypeModel[]

  // Signing algorithm for identity token. If empty, will use the server default signing algorithm.
  // readonly allowedIdentityTokenSigningAlgorithms
}
