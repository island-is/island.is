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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  allowOfflineAccess: string

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
  sliding_refresh_token_lifetime: number

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
  updateAtClaimsOnRefresh: string

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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  enableLocalLogin: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  includeJwtId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  alwaysSendClientClaims: string

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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  alwaysIncludeUcInIdToken: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  backChannelLogoutSessionRq: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  enabled: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  logoUri: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  requireConsent: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  requirePkce: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  allowPlainTextPkce: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  allowAccessTokenViaBrowser: string

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
  frontChannelLogoutSessionRq: string

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
  allowRememberConsent: string

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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  requireClientSecret: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  enableMobileLogin: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  mobileLoginText: string

  @CreatedAt
  @ApiProperty()
  readonly created: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified: Date

  @HasMany(() => ClientAllowedScope)
  @ApiProperty()
  readonly clientAllowedScope: ClientAllowedScope[]
}
