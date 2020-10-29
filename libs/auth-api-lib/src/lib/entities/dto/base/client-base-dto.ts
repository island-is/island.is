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
  readonly allowOfflineAccess: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly identityTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 3600,
  })
  readonly accessTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly authorizationCodeLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2592000,
  })
  readonly absoluteRefreshTokenLifetime: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1296000,
  })
  readonly slidingRefreshTokenLifetime: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: null,
  })
  readonly consentLifetime: number | null

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  readonly refreshTokenUsage: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly updateAccessTokenClaimsOnRefresh: boolean

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  readonly refreshTokenExpiration: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
  })
  readonly accessTokenType: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enableLocalLogin: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly includeJwtId: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly alwaysSendClientClaims: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly pairWiseSubjectSalt: string | null

  @IsOptional()
  @IsNumber({
    allowNaN: true,
  })
  @ApiProperty({
    example: null,
  })
  readonly userSsoLifetime: number | null

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly userCodeType: string | null

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 300,
  })
  readonly deviceCodeLifetime: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly alwaysIncludeUserClaimsInIdToken: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly backChannelLogoutSessionRequired: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enabled: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly logoUri: string | null

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly requireConsent: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly requirePkce: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowPlainTextPkce: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowAccessTokenViaBrowser: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly frontChannelLogoutUri: string | null

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly frontChannelLogoutSessionRequired: boolean

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: null,
  })
  readonly backChannelLogoutUri: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly allowRememberConsent: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_client_claims_prefix',
  })
  readonly clientClaimsPrefix: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly clientName: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly clientUri: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: null,
  })
  readonly description: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_protocol_type',
  })
  readonly protocolType: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly requireClientSecret: boolean
}
