import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ListItemDto } from '../../modules/listItems/models/dto/listItem.dto'

export class FieldSettingsType {
  @ApiPropertyOptional({ type: Number })
  minValue?: number

  @ApiPropertyOptional({ type: Number })
  maxValue?: number

  @ApiPropertyOptional({ type: Number })
  minLength?: number

  @ApiPropertyOptional({ type: Number })
  maxLength?: number

  @ApiPropertyOptional({ type: Date })
  minDate?: Date

  @ApiPropertyOptional({ type: Date })
  maxDate?: Date

  @ApiPropertyOptional({ type: String })
  minAmount?: string

  @ApiPropertyOptional({ type: String })
  maxAmount?: string

  @ApiPropertyOptional({ type: Number })
  year?: number

  @ApiPropertyOptional({ type: Boolean })
  hasLink?: boolean

  @ApiPropertyOptional({ type: String })
  url?: string

  @ApiPropertyOptional({ type: LanguageType })
  buttonText?: LanguageType

  @ApiPropertyOptional({ type: Boolean })
  isRequired?: boolean

  @ApiPropertyOptional({ type: Boolean })
  isLarge?: boolean

  @ApiPropertyOptional({ type: Boolean })
  hasPropertyInput?: boolean

  @ApiPropertyOptional({ type: Boolean })
  hasPropertyList?: boolean

  // @ApiPropertyOptional({ type: [ListItemDto] })
  // list?: ListItemDto[]

  @ApiPropertyOptional({ type: String })
  listType?: string

  @ApiPropertyOptional({ type: String })
  fileTypes?: string

  @ApiPropertyOptional({ type: Number })
  fileMaxSize?: number

  @ApiPropertyOptional({ type: Number })
  maxFiles?: number

  @ApiPropertyOptional({ type: String })
  timeInterval?: string
}
