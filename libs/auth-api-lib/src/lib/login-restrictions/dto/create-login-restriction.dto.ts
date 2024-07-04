import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsDateString } from 'class-validator'

export class CreateLoginRestrictionDto {
  @ApiProperty({
    description:
      'Date until which the user is restricted from logging in on new devices.',
  })
  @IsDate()
  @Type(() => Date)
  until!: Date
}
