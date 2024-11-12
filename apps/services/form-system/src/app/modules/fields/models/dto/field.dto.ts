import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
// import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldTypesEnum } from '../../../../dataTypes/fieldTypes/fieldTypes.enum'
import { ValueDto } from '../../../values/models/dto/value.dto'
import { FieldSettings } from '../../../../dataTypes/fieldSettings/fieldSettings.model'
import { ListItemDto } from '../../../listItems/models/dto/listItem.dto'

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
