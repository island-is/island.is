import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateListItemDto {
  @ApiProperty({ type: LanguageType })
  label!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  description?: LanguageType

  @ApiProperty()
  value!: string

  @ApiProperty()
  isSelected!: boolean
}
