import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class SectionDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  sectionType!: string

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  waitingText?: LanguageType
}
