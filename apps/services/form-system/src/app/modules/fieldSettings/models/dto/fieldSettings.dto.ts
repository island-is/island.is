import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListItemDto } from '../../../listItems/models/dto/listItem.dto'

export class FieldSettingsDto {
  @ApiPropertyOptional()
  minValue?: number

  @ApiPropertyOptional()
  maxValue?: number

  @ApiPropertyOptional()
  minLength?: number

  @ApiPropertyOptional()
  maxLength?: number

  @ApiPropertyOptional()
  minDate?: Date

  @ApiPropertyOptional()
  maxDate?: Date

  @ApiPropertyOptional()
  minAmount?: string

  @ApiPropertyOptional()
  maxAmount?: string

  @ApiPropertyOptional()
  year?: number

  @ApiPropertyOptional()
  hasLink?: boolean

  @ApiPropertyOptional()
  url?: string

  @ApiPropertyOptional()
  buttonText?: string

  @ApiPropertyOptional()
  hasPropertyInput?: boolean

  @ApiPropertyOptional()
  hasPropertyList?: boolean

  @ApiPropertyOptional({ type: [ListItemDto] })
  list?: ListItemDto[]

  @ApiPropertyOptional()
  listType?: string

  @ApiPropertyOptional()
  fileTypes?: string

  @ApiPropertyOptional()
  fileMaxSize?: number

  @ApiPropertyOptional()
  maxFiles?: number

  @ApiPropertyOptional()
  timeInterval?: string
}

export class TextboxFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'maxLength' | 'minLength'
>) {}

export class NumberboxFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'maxLength' | 'minLength' | 'minValue' | 'maxValue'
>) {}

export class MessageFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'hasLink' | 'url' | 'buttonText'
>) {}

export class DatePickerFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'minDate' | 'maxDate'
>) {}

export class DropdownListFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'list' | 'listType'
>) {}

export class RadioButtonsFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'list'
>) {}

export class IskNumberboxFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'minAmount' | 'maxAmount'
>) {}

export class PropertyNumberFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'hasPropertyInput' | 'hasPropertyList'
>) {}

export class DocumentFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'fileTypes' | 'fileMaxSize' | 'maxFiles'
>) {}

export class TimeInputFieldSettingsDto extends (FieldSettingsDto as new () => Pick<
  FieldSettingsDto,
  'timeInterval'
>) {}
