import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
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
  minValue?: number = 0

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxValue?: number = 0

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  minLength?: number = 0

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxLength?: number = 1000

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  minDate?: Date = new Date(0)

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  maxDate?: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() + 10),
  )

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  minAmount?: number = 0

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxAmount?: number = 1000000000

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  year?: number = new Date().getFullYear()

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasLink?: boolean = false

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  url?: string = ''

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  buttonText?: LanguageType = new LanguageType()

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isLarge?: boolean = false

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyInput?: boolean = false

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  hasPropertyList?: boolean = false

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  listType?: string = ''

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  fileTypes?: string = ''

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  fileMaxSize?: number = 10

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  maxFiles?: number = 1

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  timeInterval?: string = ''
}
