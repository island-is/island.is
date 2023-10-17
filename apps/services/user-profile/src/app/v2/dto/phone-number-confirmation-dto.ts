import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class PhoneNumberConfirmationDto {
  @ApiProperty()
  @IsString()
  readonly phoneNumber!: string

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  readonly code!: string
}
