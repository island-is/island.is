import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldTypes } from '../../../../enums/fieldTypes'

export class FieldDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  screenId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiPropertyOptional({ type: FieldSettingsDto })
  fieldSettings?: FieldSettingsDto

  @ApiProperty({ enum: FieldTypes })
  fieldType!: string
}
