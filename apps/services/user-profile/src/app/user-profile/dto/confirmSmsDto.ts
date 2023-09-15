import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmSmsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly code!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobilePhoneNumber!: string
}
