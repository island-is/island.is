import { IsString, IsNumber, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FlightDto {
  @IsString()
  @Length(10)
  @ApiProperty()
  readonly nationalId: string

  @IsNumber()
  @ApiProperty()
  readonly numberOfLegs: string
}
