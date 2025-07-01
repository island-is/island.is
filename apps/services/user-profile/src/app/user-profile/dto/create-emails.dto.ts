import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateEmailDto {
  @ApiProperty()
  @IsEmail()
  email!: string

  @ApiProperty()
  @IsString()
  code!: string
}
