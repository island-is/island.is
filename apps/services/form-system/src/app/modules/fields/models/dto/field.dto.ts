import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldSettings } from '../../../../dataTypes/fieldSettings/fieldSettings.model'
import { ListItemDto } from '../../../listItems/models/dto/listItem.dto'
import { ValueDto } from '../../../applications/models/dto/value.dto'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray
} from 'class-validator'
import { Type } from 'class-transformer'

export class FieldDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  screenId!: string

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @IsNumber()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  description!: LanguageType

  @ApiProperty()
  @IsBoolean()
  isPartOfMultiset!: boolean

  @ApiProperty()
  @IsBoolean()
  isRequired!: boolean

  @ApiProperty()
  @IsBoolean()
  isHidden!: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: FieldSettings })
  @ValidateNested()
  @Type(() => FieldSettings)
  fieldSettings?: FieldSettings

  @ApiProperty()
  @IsString()
  fieldType!: string

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [ListItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ListItemDto)
  list?: ListItemDto[]

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [ValueDto] })
  @ValidateNested({ each: true })
  @Type(() => ValueDto)
  values?: ValueDto[]
}
