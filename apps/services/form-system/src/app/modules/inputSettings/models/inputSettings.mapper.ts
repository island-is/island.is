import { Injectable } from '@nestjs/common'
import { UpdateInputSettingsDto } from './dto/updateInputSettings.dto'
import { InputSettings } from './inputSettings.model'
import {
  DatePickerInputSettingsDto,
  DocumentInputSettingsDto,
  DropdownListInputSettingsDto,
  InputSettingsDto,
  IskNumberboxInputSettingsDto,
  MessageInputSettingsDto,
  NumberboxInputSettingsDto,
  PropertyNumberInputSettingsDto,
  RadioButtonsInputSettingsDto,
  TextboxInputSettingsDto,
  TimeInputInputSettingsDto,
} from './dto/inputSettings.dto'

@Injectable()
export class InputSettingsMapper {
  mapUpdateInputSettingsDtoToInputSettings(
    inputSettings: InputSettings,
    updateInputSettingsDto: UpdateInputSettingsDto,
  ): void {
    console.log(updateInputSettingsDto.minLength)
    ;(inputSettings.modified = new Date()),
      (inputSettings.minValue = updateInputSettingsDto.minValue ?? null),
      (inputSettings.maxValue = updateInputSettingsDto.maxValue ?? null),
      (inputSettings.minLength = updateInputSettingsDto.minLength ?? null),
      (inputSettings.maxLength = updateInputSettingsDto.maxLength ?? null),
      (inputSettings.minDate = updateInputSettingsDto.minDate ?? null),
      (inputSettings.maxDate = updateInputSettingsDto.maxDate ?? null),
      (inputSettings.minAmount = updateInputSettingsDto.minAmount ?? null),
      (inputSettings.maxAmount = updateInputSettingsDto.maxAmount ?? null),
      (inputSettings.year = updateInputSettingsDto.year ?? null),
      (inputSettings.hasLink = updateInputSettingsDto.hasLink ?? null),
      (inputSettings.url = updateInputSettingsDto.url ?? null),
      (inputSettings.buttonText = updateInputSettingsDto.buttonText ?? null),
      (inputSettings.hasPropertyInput =
        updateInputSettingsDto.hasPropertyInput ?? null),
      (inputSettings.hasPropertyList =
        updateInputSettingsDto.hasPropertyList ?? null),
      (inputSettings.list = updateInputSettingsDto.list ?? null),
      (inputSettings.fileTypes = updateInputSettingsDto.fileTypes ?? null),
      (inputSettings.fileMaxSize = updateInputSettingsDto.fileMaxSize ?? null),
      (inputSettings.maxFiles = updateInputSettingsDto.maxFiles ?? null),
      (inputSettings.timeInterval = updateInputSettingsDto.timeInterval ?? null)

    console.log(inputSettings.minLength)
  }

  mapInputTypeToInputSettings(
    inputSettings: InputSettings | null,
    inputType: string,
  ): InputSettingsDto {
    switch (inputType) {
      case 'textbox':
        return {
          maxLength: inputSettings ? inputSettings.maxLength : null,
          minLength: inputSettings ? inputSettings.minLength : null,
        } as TextboxInputSettingsDto
      case 'numberbox':
        return {
          maxLength: inputSettings ? inputSettings.maxLength : null,
          minLength: inputSettings ? inputSettings.minLength : null,
          maxValue: inputSettings ? inputSettings.maxValue : null,
          minValue: inputSettings ? inputSettings.minValue : null,
        } as NumberboxInputSettingsDto
      case 'message':
        return {
          hasLink: inputSettings ? inputSettings.hasLink : null,
          url: inputSettings ? inputSettings.url : null,
          buttonText: inputSettings ? inputSettings.buttonText : null,
        } as MessageInputSettingsDto
      case 'datePicker':
        return {
          minDate: inputSettings ? inputSettings.minDate : null,
          maxDate: inputSettings ? inputSettings.maxDate : null,
        } as DatePickerInputSettingsDto
      case 'dropdownList':
        return {
          list: inputSettings ? inputSettings.list : null,
        } as DropdownListInputSettingsDto
      case 'radioButtons':
        return {
          list: inputSettings ? inputSettings.list : null,
        } as RadioButtonsInputSettingsDto
      case 'iskNumberbox':
        return {
          minAmount: inputSettings ? inputSettings.minAmount : null,
          maxAmount: inputSettings ? inputSettings.maxAmount : null,
        } as IskNumberboxInputSettingsDto
      case 'propertyNumber':
        return {
          hasPropertyInput: inputSettings
            ? inputSettings.hasPropertyInput
            : null,
          hasPropertyList: inputSettings ? inputSettings.hasPropertyList : null,
        } as PropertyNumberInputSettingsDto
      case 'document':
        return {
          fileTypes: inputSettings ? inputSettings.fileTypes : null,
          fileMaxSize: inputSettings ? inputSettings.fileMaxSize : null,
          maxFiles: inputSettings ? inputSettings.maxFiles : null,
        } as DocumentInputSettingsDto
      case 'timeInput':
        return {
          timeInterval: inputSettings ? inputSettings.timeInterval : null,
        } as TimeInputInputSettingsDto
      default:
        return {}
    }
  }
}
