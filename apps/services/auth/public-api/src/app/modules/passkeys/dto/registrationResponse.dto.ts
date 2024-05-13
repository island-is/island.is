import { ApiProperty } from '@nestjs/swagger'

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
  @ApiProperty({ required: false })
  rk?: boolean
}

class RegistrationResponseClientExtensionResults {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  appid?: boolean

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: ClientExtensionResultsCredProps,
    required: false,
  })
  credProps?: ClientExtensionResultsCredProps

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
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
  @ApiProperty({
    type: [String],
    required: false,
  })
  transports?: AuthenticatorTransportFuture[]

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  publicKeyAlgorithm?: COSEAlgorithmIdentifier

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  publicKey?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
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
  @ApiProperty({ required: false })
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
