import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from './languageType.model'

export class ListItem {
  @ApiProperty()
  id?: string

  @ApiProperty({ type: LanguageType })
  label!: LanguageType

  @ApiProperty({ type: LanguageType })
  description?: LanguageType

  @ApiProperty()
  value?: string

  @ApiProperty()
  displayOrder?: number

  @ApiProperty()
  isSelected!: boolean
}
