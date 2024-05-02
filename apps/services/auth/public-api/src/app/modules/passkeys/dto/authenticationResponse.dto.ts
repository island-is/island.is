import { ApiProperty } from '@nestjs/swagger'

import { IsObject, IsOptional, IsString } from 'class-validator'

export class AuthenticationResponseBody {
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
  @ApiProperty()
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
  @ApiProperty()
  authenticatorAttachment?: string

  @IsObject()
  @ApiProperty({
    type: Object,
  })
  clientExtensionResults!: object

  @IsString()
  @ApiProperty()
  type!: string
}
