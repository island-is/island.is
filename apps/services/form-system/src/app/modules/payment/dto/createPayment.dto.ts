import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
  @ApiPropertyOptional()
  @IsOptional()
  readonly fulfilled?: boolean

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  readonly user4?: string

  @IsObject()
  @ApiPropertyOptional()
  @IsOptional()
  definition?: object

  @IsNumber()
  @ApiProperty()
  readonly amount!: number

  @IsDate()
  @ApiPropertyOptional()
  @IsOptional()
  readonly expires_at?: Date
}
