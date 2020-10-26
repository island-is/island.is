import {
  IsNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSmsVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobilePhoneNumber!: string
}
