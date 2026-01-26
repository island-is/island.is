import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ListItemDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  identifier!: string

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  label!: LanguageType

  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  description?: LanguageType

  @ApiProperty()
  @IsString()
  value!: string

  @ApiProperty()
  @IsNumber()
  displayOrder!: number

  @ApiProperty()
  @IsBoolean()
  isSelected!: boolean
}
