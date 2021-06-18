import { IsString, IsNumber, IsDate, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateChargeDto {
  @IsString()
  @ApiProperty()
  readonly application_id!: string

  @IsNumber()
  @ApiProperty()
  readonly amount!: number
}
