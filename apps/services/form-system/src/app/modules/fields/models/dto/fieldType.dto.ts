import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldTypes } from '../../../../enums/fieldTypes'

export class FieldTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ enum: FieldTypes })
  type!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean

  @ApiPropertyOptional({ type: FieldSettingsDto })
  fieldSettings?: FieldSettingsDto
}
