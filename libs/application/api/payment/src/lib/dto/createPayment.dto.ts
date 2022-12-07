import { IsString, IsNumber, IsDate, IsObject } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentDto {
  @IsString()
  @ApiProperty()
  readonly application_id!: string

  @IsString()
  @ApiProperty()
  readonly fulfilled?: boolean

  @IsString()
  @ApiProperty()
  readonly user4?: string

  @IsObject()
  @ApiProperty()
  definition?: string

  @IsNumber()
  @ApiProperty()
  readonly amount!: number

  @IsDate()
  @ApiProperty()
  readonly expires_at?: Date
}
