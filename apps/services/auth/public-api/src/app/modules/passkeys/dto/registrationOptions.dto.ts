import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  authenticatorAttachment?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  requireResidentKey?: boolean

  @IsString()
  @ApiProperty()
  @ApiPropertyOptional()
  residentKey?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
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
  @ApiPropertyOptional({
    type: [String],
  })
  transports!: string[]
}

class RegistrationOptionsExtensions {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  appid?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  credProps?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  timeout?: number

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  attestation?: string

  @IsArray()
  @Type(() => RegistrationOptionsPublicKeyCredentialDescriptorJSON)
  @ApiPropertyOptional({
    type: [RegistrationOptionsPublicKeyCredentialDescriptorJSON],
  })
  excludeCredentials?: RegistrationOptionsPublicKeyCredentialDescriptorJSON[]

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    type: RegistrationOptionsAuthenticatorSelection,
  })
  authenticatorSelection?: RegistrationOptionsAuthenticatorSelection

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    type: RegistrationOptionsExtensions,
  })
  extensions?: RegistrationOptionsExtensions
}

export class RegistrationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean
}
