import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'

export class ApplicationFieldDto {
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

  @ApiProperty({ type: FieldSettingsDto })
  fieldSettings?: FieldSettingsDto

  @ApiProperty()
  fieldType!: string
}
