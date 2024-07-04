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
