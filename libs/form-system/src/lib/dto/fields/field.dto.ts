import { FieldSettings, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListItemDto } from '../listItems/listItem.dto'
import { ValueDto } from '../applications/value.dto'

export class FieldDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  screenId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isPartOfMultiset!: boolean

  @ApiProperty()
  isRequired!: boolean

  @ApiProperty()
  isHidden!: boolean

  @ApiPropertyOptional({ type: FieldSettings })
  fieldSettings?: FieldSettings

  @ApiProperty()
  fieldType!: string

  @ApiPropertyOptional({ type: [ListItemDto] })
  list?: ListItemDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  values?: ValueDto[]
}
