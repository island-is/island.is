import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, Length } from 'class-validator'

export class VerifyDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly mobilePhoneNumber?: string

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  readonly code!: string
}
