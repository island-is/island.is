import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { InputSettings } from '../inputSettings.model'
import { InputType } from '../inputType.model'

export class InputDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  groupId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: Date })
  created!: Date

  @ApiProperty({ type: Date })
  modified!: Date

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isHidden!: boolean

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiProperty({ type: InputSettings })
  inputSettings?: InputSettings

  @ApiProperty()
  inputType!: string
}
