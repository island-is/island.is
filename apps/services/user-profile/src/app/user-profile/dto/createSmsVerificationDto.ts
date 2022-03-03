import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone,IsNotEmpty, IsString } from 'class-validator'

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
