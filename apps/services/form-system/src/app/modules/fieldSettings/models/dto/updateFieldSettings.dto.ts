import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateFieldSettingsDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  minValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  maxValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  minLength?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  maxLength?: number

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  minDate?: Date

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  maxDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  minAmount?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  maxAmount?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  year?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  hasLink?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  url?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  buttonText?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  hasPropertyInput?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  hasPropertyList?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  listType?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  fileTypes?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  fileMaxSize?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  maxFiles?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  timeInterval?: string
}
