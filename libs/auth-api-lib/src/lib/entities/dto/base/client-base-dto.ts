import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export abstract class ClientBaseDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  allowOfflineAccess: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  identityTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 3600,
  })
  accessTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  authorizationCodeLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2592000,
  })
  absoluteRefreshTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  refreshTokenUsage: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  updateAccessTokenClaimsOnRefresh: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  refreshTokenExpiration: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  accessTokenType: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  enableLocalLogin: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  includeJwtId: boolean

  @IsBoolean()
  @IsNotEmpty()
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
    allowNaN: true,
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
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  deviceCodeLifetime: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  alwaysIncludeUserClaimsInIdToken: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  backChannelLogoutSessionRequired: string

  @IsBoolean()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  requireConsent: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  requirePkce: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  allowPlainTextPkce: boolean

  @IsBoolean()
  @IsNotEmpty()
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
  @IsNotEmpty()
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
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  allowRememberConsent: boolean

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_protocol_type',
  })
  protocolType: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  requireClientSecret: boolean
}
