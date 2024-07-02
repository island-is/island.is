import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'

export class FieldTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  type!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean

  @ApiProperty({ type: FieldSettingsDto })
  fieldSettings?: FieldSettingsDto
}
