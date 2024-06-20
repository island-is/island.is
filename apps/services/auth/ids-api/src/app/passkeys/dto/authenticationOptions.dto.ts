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
  @ApiProperty()
  idp!: string

  @IsString()
  @ApiProperty()
  sub!: string
}
