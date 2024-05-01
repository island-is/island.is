import { ApiProperty } from '@nestjs/swagger'

import { IsObject, IsOptional, IsString } from 'class-validator'

export class RegistrationResponse {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  rawId!: string

  @IsObject()
  @ApiProperty({
    type: Object,
  })
  response!: object

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
