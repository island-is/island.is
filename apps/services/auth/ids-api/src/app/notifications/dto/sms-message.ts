import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class SmsMessage {
  @IsString()
  @Length(7, 7)
  @ApiProperty()
  toPhoneNumber!: string

  @IsString()
  @ApiProperty()
  content!: string
}
