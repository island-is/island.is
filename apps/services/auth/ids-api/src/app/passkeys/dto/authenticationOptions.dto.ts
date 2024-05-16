import { ApiProperty } from '@nestjs/swagger'

import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class AuthenticationOptions {
  @IsString()
  @ApiProperty()
  passkey: string
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
