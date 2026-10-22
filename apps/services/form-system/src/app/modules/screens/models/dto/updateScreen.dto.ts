import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateScreenDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  identifier?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  multiMax?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isMulti?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  shouldValidate?: boolean
}
