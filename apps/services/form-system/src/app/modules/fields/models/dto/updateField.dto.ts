import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { UpdateFieldSettingsDto } from '../../../fieldSettings/models/dto/updateFieldSettings.dto'

export class UpdateFieldDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiProperty({ type: UpdateFieldSettingsDto })
  fieldSettings?: UpdateFieldSettingsDto

  @ApiProperty()
  fieldType!: string
}
