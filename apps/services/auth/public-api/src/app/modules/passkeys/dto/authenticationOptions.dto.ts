import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class AuthenticationOptionsPublicKeyCredentialDescriptor {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  type!: string

  @IsArray()
  @Type(() => String)
  @ApiProperty({ type: [String] })
  transports!: string[]
}

export class AuthenticationOptionsExtensions {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  appid?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  credProps?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  hmacCreateSecret?: boolean
}

export class AuthenticationOptions {
  @IsString()
  @ApiProperty()
  challenge!: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  timeout?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  rpId?: string

  @IsOptional()
  @IsArray()
  @Type(() => AuthenticationOptionsPublicKeyCredentialDescriptor)
  @ApiPropertyOptional({
    type: [AuthenticationOptionsPublicKeyCredentialDescriptor],
  })
  allowCredentials?: AuthenticationOptionsPublicKeyCredentialDescriptor[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  userVerification?: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    type: AuthenticationOptionsExtensions,
  })
  extensions?: AuthenticationOptionsExtensions
}

export class AuthenticationResponse {
  @IsString()
  @ApiProperty({
    description:
      'The authenticator response as base64 encoded JSON, as for a passkey login.',
  })
  passkey!: string
}

export class AuthenticationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean

  @IsDate()
  @ApiProperty({
    description:
      'When the passkey was registered. Only trust a passkey registered before what it is used to reopen.',
  })
  registeredAt!: Date
}
