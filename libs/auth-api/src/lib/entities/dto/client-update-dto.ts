import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClientUpdateDTO {
  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  allowOfflineAccess: boolean

  @IsNumber()
  @ApiProperty({
    example: 300,
  })
  identityTokenLifetime: number

  @IsNumber()
  @ApiProperty({
    example: 3600,
  })
  accessTokenLifetime: number

  @IsNumber()
  @ApiProperty({
    example: 300,
  })
  authorizationCodeLifetime: number

  @IsNumber()
  @ApiProperty({
    example: 2592000,
  })
  absoluteRefreshTokenLifetime: number

  @IsNumber()
  @ApiProperty({
    example: 1296000,
  })
  slidingRefreshTokenLifetime: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: null,
  })
  consentLifetime: number

  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  refreshTokenUsage: number

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  updateAccessTokenClaimsOnRefresh: boolean

  @IsNumber()
  @ApiProperty({
    example: 0,
  })
  refreshTokenExpiration: number

  @IsNumber()
  @ApiProperty({
    example: 0,
  })
  accessTokenType: number

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  enableLocalLogin: boolean

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  includeJwtId: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  alwaysSendClientClaims: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  pairWiseSubjectSalt: string

  @IsOptional()
  @IsNumber({
    allowNaN: true
  })
  @ApiProperty({
    example: null,
  })
  userSsoLifetime: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  userCodeType: string

  @IsNumber()
  @ApiProperty({
    example: 300,
  })
  deviceCodeLifetime: number

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  alwaysIncludeUserClaimsInIdToken: boolean

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  backChannelLogoutSessionRequired: string

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  enabled: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  logoUri: string

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  requireConsent: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  requirePkce: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  allowPlainTextPkce: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  allowAccessTokenViaBrowser: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  frontChannelLogoutUri: string

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  frontChannelLogoutSessionRequired: boolean

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: null,
  })
  backChannelLogoutUri: string

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  allowRememberConsent: boolean

  @IsString()
  @ApiProperty({
    example: 'set_client_claims_prefix',
  })
  clientClaimsPrefix: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  clientName: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  clientUri: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  description: string

  @IsString()
  @ApiProperty({
    example: 'set_protocol_type',
  })
  protocolType: string

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  requireClientSecret: boolean
}
