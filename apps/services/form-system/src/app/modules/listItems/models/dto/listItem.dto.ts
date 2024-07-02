import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class ListItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  label!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  description?: LanguageType

  @ApiProperty()
  value!: string

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  isSelected!: boolean
}
