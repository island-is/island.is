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
  @ApiProperty()
  appid?: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
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
  @ApiProperty()
  timeout?: number

  @IsOptional()
  @IsString()
  @ApiProperty()
  rpId?: string

  @IsOptional()
  @IsArray()
  @Type(() => AuthenticationOptionsPublicKeyCredentialDescriptor)
  @ApiProperty({
    type: [AuthenticationOptionsPublicKeyCredentialDescriptor],
  })
  allowCredentials?: AuthenticationOptionsPublicKeyCredentialDescriptor[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  userVerification?: string

  @IsOptional()
  @IsObject()
  @ApiProperty({
    type: AuthenticationOptionsExtensions,
  })
  extensions?: AuthenticationOptionsExtensions
}

export class AuthenticationResult {
  @IsBoolean()
  @ApiProperty()
  verified!: boolean

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  idp?: string

  @IsString()
  @ApiProperty()
  sub!: string
}
