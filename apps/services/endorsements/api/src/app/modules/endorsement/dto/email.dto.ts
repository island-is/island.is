import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class emailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailAddress!: string
}
