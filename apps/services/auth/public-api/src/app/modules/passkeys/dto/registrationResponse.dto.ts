import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type {
  AuthenticatorAttachment,
  PublicKeyCredentialType,
  AuthenticatorTransportFuture,
  COSEAlgorithmIdentifier,
} from '@simplewebauthn/types'

import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'

class ClientExtensionResultsCredProps {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  rk?: boolean
}

class RegistrationResponseClientExtensionResults {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  appid?: boolean

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    type: ClientExtensionResultsCredProps,
  })
  credProps?: ClientExtensionResultsCredProps

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hmacCreateSecret?: boolean
}

class RegistrationResponseResponse {
  @IsString()
  @ApiProperty()
  attestationObject!: string

  @IsString()
  @ApiProperty()
  clientDataJSON!: string

  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
  })
  transports?: AuthenticatorTransportFuture[]

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  publicKeyAlgorithm?: COSEAlgorithmIdentifier

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  publicKey?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  authenticatorData?: string
}

export class RegistrationResponse {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  rawId!: string

  @IsObject()
  @ApiProperty({
    type: RegistrationResponseResponse,
  })
  response!: RegistrationResponseResponse

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  authenticatorAttachment?: AuthenticatorAttachment

  @IsObject()
  @ApiProperty({
    type: RegistrationResponseClientExtensionResults,
  })
  clientExtensionResults!: RegistrationResponseClientExtensionResults

  @IsString()
  @ApiProperty()
  type!: PublicKeyCredentialType
}
