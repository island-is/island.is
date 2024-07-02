import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateListItemDto {
  @ApiProperty()
  label!: LanguageType

  @ApiProperty()
  description?: LanguageType

  @ApiProperty()
  value!: string

  @ApiProperty()
  isSelected!: boolean
}
