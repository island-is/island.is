import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
