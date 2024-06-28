import { ApiProperty } from '@nestjs/swagger'
import { ListItemDto } from '../../../listItems/models/dto/listItem.dto'

export class FieldSettingsDto {
  @ApiProperty()
  minValue?: number

  @ApiProperty()
  maxValue?: number

  @ApiProperty()
  minLength?: number

  @ApiProperty()
  maxLength?: number

  @ApiProperty()
  minDate?: Date

  @ApiProperty()
  maxDate?: Date

  @ApiProperty()
  minAmount?: string

  @ApiProperty()
  maxAmount?: string

  @ApiProperty()
  year?: number

  @ApiProperty()
  hasLink?: boolean

  @ApiProperty()
  url?: string

  @ApiProperty()
  buttonText?: string

  @ApiProperty()
  hasPropertyInput?: boolean

  @ApiProperty()
  hasPropertyList?: boolean

  @ApiProperty({ type: [ListItemDto] })
  list?: ListItemDto[]

  @ApiProperty()
  listType?: string

  @ApiProperty()
  fileTypes?: string

  @ApiProperty()
  fileMaxSize?: number

  @ApiProperty()
  maxFiles?: number

  @ApiProperty()
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
