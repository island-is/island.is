import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsEnum,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientSso, ClientType } from '../../../types'

export class ClientBaseDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234567890',
  })
  readonly nationalId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'spa',
  })
  readonly clientType!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@island.is',
  })
  readonly domainName!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowOfflineAccess!: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly identityTokenLifetime!: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 3600,
  })
  readonly accessTokenLifetime!: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly authorizationCodeLifetime!: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2592000,
  })
  readonly absoluteRefreshTokenLifetime!: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1296000,
  })
  readonly slidingRefreshTokenLifetime!: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: null,
  })
  readonly consentLifetime?: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  readonly refreshTokenUsage!: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly updateAccessTokenClaimsOnRefresh!: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  readonly refreshTokenExpiration!: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  readonly accessTokenType!: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enableLocalLogin!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly includeJwtId!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly alwaysSendClientClaims!: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly pairWiseSubjectSalt?: string

  @IsOptional()
  @IsNumber({
    allowNaN: true,
  })
  @ApiProperty({
    example: null,
  })
  readonly userSsoLifetime?: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly userCodeType?: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly deviceCodeLifetime!: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly alwaysIncludeUserClaimsInIdToken!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly backChannelLogoutSessionRequired!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enabled!: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly logoUri?: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly requireConsent!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly requirePkce!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowPlainTextPkce!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowAccessTokenViaBrowser!: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly frontChannelLogoutUri?: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly frontChannelLogoutSessionRequired!: boolean

  @IsOptional()
  @ApiProperty({
    example: null,
  })
  readonly backChannelLogoutUri?: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly allowRememberConsent!: boolean

  @IsOptional()
  @ApiProperty({
    example: 'set_client_claims_prefix',
  })
  readonly clientClaimsPrefix!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly clientName?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly clientUri?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly description?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_protocol_type',
  })
  readonly protocolType!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly requireClientSecret!: boolean

  @IsOptional()
  @ApiProperty({
    example: null,
  })
  contactEmail!: string

  @IsArray()
  @ApiProperty({
    type: [String],
  })
  supportedDelegationTypes!: string[]

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    deprecated: true,
  })
  readonly supportsCustomDelegation!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    deprecated: true,
  })
  readonly supportsLegalGuardians!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    deprecated: true,
  })
  readonly supportsProcuringHolders!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    deprecated: true,
  })
  readonly supportsPersonalRepresentatives!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly promptDelegations!: boolean

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  readonly requireApiScopes!: boolean

  @IsEnum(ClientSso)
  @ApiProperty({
    example: 'disabled',
    enum: ClientSso,
    enumName: 'ClientSso',
  })
  readonly sso!: string
}
