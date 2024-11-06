import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
// import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldTypesEnum } from '../../../../enums/fieldTypes'
import { FieldSettings } from '../../../../dataTypes/fieldSettings/fieldSettings.model'

export class FieldTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ enum: FieldTypesEnum })
  type!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean

  @ApiPropertyOptional({ type: FieldSettings })
  fieldSettings?: FieldSettings

  //   @ApiPropertyOptional({ type: FieldSettingsDto })
  //   fieldSettings?: FieldSettingsDto
  // }
}
