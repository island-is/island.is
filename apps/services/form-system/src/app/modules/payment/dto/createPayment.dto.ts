import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  @ApiProperty()
  readonly application_id!: string

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  readonly fulfilled?: boolean

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly user4?: string

  @IsObject()
  @ApiProperty()
  @IsOptional()
  definition?: object

  @IsNumber()
  @ApiProperty()
  readonly amount!: number

  @IsDate()
  @ApiProperty()
  @IsOptional()
  readonly expires_at?: Date
}
