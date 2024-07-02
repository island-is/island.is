import { ApiProperty } from '@nestjs/swagger'

export class InputSettingsDto {
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

  @ApiProperty()
  list?: string

  @ApiProperty()
  fileTypes?: string

  @ApiProperty()
  fileMaxSize?: number

  @ApiProperty()
  maxFiles?: number

  @ApiProperty()
  timeInterval?: string
}

export class TextboxInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'maxLength' | 'minLength'
>) {}

export class NumberboxInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'maxLength' | 'minLength' | 'minValue' | 'maxValue'
>) {}

export class MessageInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'hasLink' | 'url' | 'buttonText'
>) {}

export class DatePickerInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'minDate' | 'maxDate'
>) {}

export class DropdownListInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'list'
>) {}

export class RadioButtonsInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'list'
>) {}

export class IskNumberboxInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'minAmount' | 'maxAmount'
>) {}

export class PropertyNumberInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'hasPropertyInput' | 'hasPropertyList'
>) {}

export class DocumentInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'fileTypes' | 'fileMaxSize' | 'maxFiles'
>) {}

export class TimeInputInputSettingsDto extends (InputSettingsDto as new () => Pick<
  InputSettingsDto,
  'timeInterval'
>) {}
