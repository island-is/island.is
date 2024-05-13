import { ApiProperty } from '@nestjs/swagger'

import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'

import type {
  PublicKeyCredentialType,
  AuthenticatorAttachment,
} from '@simplewebauthn/types'

class ClientExtensionResultsCredProps {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  rk?: boolean
}

class AuthenticationResponseClientExtensionResults {
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

class AuthenticationResponseBody {
  @IsString()
  @ApiProperty()
  authenticatorData!: string

  @IsString()
  @ApiProperty()
  clientDataJSON!: string

  @IsString()
  @ApiProperty()
  signature!: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userHandle?: string
}

export class AuthenticationResponse {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  rawId!: string

  @IsObject()
  @ApiProperty({
    type: AuthenticationResponseBody,
  })
  response!: AuthenticationResponseBody

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  authenticatorAttachment?: AuthenticatorAttachment

  @IsObject()
  @ApiProperty({
    type: AuthenticationResponseClientExtensionResults,
  })
  clientExtensionResults!: AuthenticationResponseClientExtensionResults

  @IsString()
  @ApiProperty()
  type!: PublicKeyCredentialType
}
