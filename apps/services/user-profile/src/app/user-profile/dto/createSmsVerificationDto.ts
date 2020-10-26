import { IsNotEmpty, IsString, IsMobilePhone } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSmsVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsMobilePhone()
  @ApiProperty()
  readonly mobilePhoneNumber!: string
}
