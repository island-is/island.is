import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { InputSettingsDto } from '../../../inputSettings/models/dto/inputSettings.dto'

export class InputDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  groupId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiProperty({ type: InputSettingsDto })
  inputSettings?: InputSettingsDto

  @ApiProperty()
  inputType!: string
}
