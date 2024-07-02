import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { UpdateInputSettingsDto } from '../../../inputSettings/models/dto/updateInputSettings.dto'

export class UpdateInputDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiProperty({ type: UpdateInputSettingsDto })
  inputSettings?: UpdateInputSettingsDto

  @ApiProperty()
  inputType!: string
}
