import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateListItemDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  label!: LanguageType

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  description?: LanguageType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  value!: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isSelected!: boolean
}
