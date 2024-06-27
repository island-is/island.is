import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class FormsListFormDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  urlName!: String

  @ApiProperty()
  invalidationDate?: Date

  @ApiProperty()
  created!: Date

  @ApiProperty()
  modified!: Date

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: number

  @ApiProperty()
  stopProgressOnValidatingPage!: boolean
}
