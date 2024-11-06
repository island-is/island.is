import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ListItemDto } from '../../modules/listItems/models/dto/listItem.dto'
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class FieldSettings {
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
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  minDate?: Date

  @IsOptional()
  @IsDateString()
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
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  buttonText?: LanguageType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isLarge?: boolean

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
