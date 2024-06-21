import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { InputSettingsDto } from '../../../inputSettings/models/dto/inputSettings.dto'

export class InputTypeDto {
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

  @ApiProperty({ type: InputSettingsDto })
  inputSettings?: InputSettingsDto
}
