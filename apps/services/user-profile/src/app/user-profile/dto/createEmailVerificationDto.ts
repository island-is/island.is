import { IsNotEmpty, IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEmailVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email!: string
}
