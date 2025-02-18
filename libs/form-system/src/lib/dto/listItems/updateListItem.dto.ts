import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

export class UpdateListItemDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  label?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  description?: LanguageType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  value?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isSelected?: boolean
}
