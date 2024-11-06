import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
// import { FieldSettingsDto } from '../../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldTypes } from '../../../../enums/fieldTypes'
import { ValueDto } from '../../../values/models/dto/value.dto'
import { FieldSettingsType } from '../../../../dataTypes/fieldSettingsTypes/fieldSettingsType.model'
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

  // @ApiPropertyOptional({ type: FieldSettingsDto })
  // fieldSettings?: FieldSettingsDto

  @ApiPropertyOptional({ type: FieldSettingsType })
  fieldSettingsType?: FieldSettingsType

  @ApiProperty({ enum: FieldTypes })
  fieldType!: string

  @ApiPropertyOptional({ type: [ListItemDto] })
  list?: ListItemDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  values?: ValueDto[]
}
