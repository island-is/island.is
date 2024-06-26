import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class ListItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: LanguageType

  @ApiProperty()
  description?: LanguageType

  @ApiProperty()
  value!: string

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  isSelected!: boolean
}
