import { IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmSmsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobilePhoneNumber!: string

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  readonly code!: string
}
