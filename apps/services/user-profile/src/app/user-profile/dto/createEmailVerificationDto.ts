import { ApiProperty } from '@nestjs/swagger'
import { IsEmail,IsNotEmpty, IsString } from 'class-validator'

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
