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
  @ApiPropertyOptional({ type: Number })
  minValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  minLength?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxLength?: number

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  minDate?: Date

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  maxDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  minAmount?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  maxAmount?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  year?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasLink?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  url?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  buttonText?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyInput?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyList?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  listType?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  fileTypes?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  fileMaxSize?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxFiles?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  timeInterval?: string
}
