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
  @ApiProperty()
  id!: string

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
  @ApiProperty()
  residentKey!: string

  @IsString()
  @ApiProperty()
  userVerification!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  requireResidentKey?: string
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
  @ApiProperty({
    type: [String],
  })
  transports!: string[]
}

class RegistrationOptionsExtensions {
  @IsBoolean()
  @ApiProperty()
  credProps!: boolean
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
  @ApiProperty()
  timeout!: number

  @IsString()
  @ApiProperty()
  attestation!: string

  @IsArray()
  @Type(() => RegistrationOptionsPublicKeyCredentialDescriptorJSON)
  @ApiProperty({
    type: [RegistrationOptionsPublicKeyCredentialDescriptorJSON],
  })
  excludeCredentials!: RegistrationOptionsPublicKeyCredentialDescriptorJSON[]

  @IsObject()
  @ApiProperty({
    type: RegistrationOptionsAuthenticatorSelection,
  })
  authenticatorSelection!: RegistrationOptionsAuthenticatorSelection

  @IsObject()
  @ApiProperty({
    type: RegistrationOptionsExtensions,
  })
  extensions!: RegistrationOptionsExtensions
}

export class RegistrationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean
}
