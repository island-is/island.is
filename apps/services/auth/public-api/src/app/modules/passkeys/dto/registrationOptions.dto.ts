import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

class RegistrationOptionsRp {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  id?: string

  @IsString()
  @ApiProperty()
  name!: string
}

class RegistrationOptionsUser {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
  displayName!: string
}

class RegistrationOptionsPublicKeyCredentialOption {
  @IsNumber()
  @ApiProperty()
  alg!: number

  @IsString()
  @ApiProperty()
  type!: string
}

class RegistrationOptionsAuthenticatorSelection {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  authenticatorAttachment?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  requireResidentKey?: boolean

  @IsString()
  @ApiProperty()
  @ApiProperty({ required: false })
  residentKey?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userVerification?: string
}

class RegistrationOptionsPublicKeyCredentialDescriptorJSON {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  type!: string

  @IsArray()
  @Type(() => String)
  @IsOptional()
  @ApiProperty({
    type: [String],
    required: false,
  })
  transports!: string[]
}

class RegistrationOptionsExtensions {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  appid?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  credProps?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  hmacCreateSecret?: boolean
}

export class RegistrationOptions {
  @IsString()
  @ApiProperty()
  challenge!: string

  @IsObject()
  @ApiProperty({
    type: RegistrationOptionsRp,
  })
  rp!: RegistrationOptionsRp

  @IsObject()
  @ApiProperty({
    type: RegistrationOptionsUser,
  })
  user!: RegistrationOptionsUser

  @IsArray()
  @Type(() => RegistrationOptionsPublicKeyCredentialOption)
  @ApiProperty({
    type: [RegistrationOptionsPublicKeyCredentialOption],
  })
  pubKeyCredParams!: RegistrationOptionsPublicKeyCredentialOption[]

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  timeout?: number

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  attestation?: string

  @IsArray()
  @Type(() => RegistrationOptionsPublicKeyCredentialDescriptorJSON)
  @ApiProperty({
    type: [RegistrationOptionsPublicKeyCredentialDescriptorJSON],
    required: false,
  })
  excludeCredentials?: RegistrationOptionsPublicKeyCredentialDescriptorJSON[]

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: RegistrationOptionsAuthenticatorSelection,
    required: false,
  })
  authenticatorSelection?: RegistrationOptionsAuthenticatorSelection

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: RegistrationOptionsExtensions,
    required: false,
  })
  extensions?: RegistrationOptionsExtensions
}

export class RegistrationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean
}
