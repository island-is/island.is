import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class ConfirmPhoneNumberDto {
  @ApiProperty()
  @IsString()
  phoneNumber: string

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  code: string
}
