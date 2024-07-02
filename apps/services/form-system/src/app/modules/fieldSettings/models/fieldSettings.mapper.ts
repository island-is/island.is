import { Injectable } from '@nestjs/common'
import { UpdateFieldSettingsDto } from './dto/updateFieldSettings.dto'
import { FieldSettings } from './fieldSettings.model'
import {
  DatePickerFieldSettingsDto,
  DocumentFieldSettingsDto,
  DropdownListFieldSettingsDto,
  FieldSettingsDto,
  IskNumberboxFieldSettingsDto,
  MessageFieldSettingsDto,
  NumberboxFieldSettingsDto,
  PropertyNumberFieldSettingsDto,
  RadioButtonsFieldSettingsDto,
  TextboxFieldSettingsDto,
  TimeInputFieldSettingsDto,
} from './dto/fieldSettings.dto'
import { ListItemMapper } from '../../listItems/models/listItem.mapper'

@Injectable()
export class FieldSettingsMapper {
  constructor(private readonly listItemMapper: ListItemMapper) {}
  mapUpdateFieldSettingsDtoToFieldSettings(
    fieldSettings: FieldSettings,
    updateFieldSettingsDto: UpdateFieldSettingsDto,
  ): void {
    ;(fieldSettings.modified = new Date()),
      (fieldSettings.minValue = updateFieldSettingsDto.minValue ?? null),
      (fieldSettings.maxValue = updateFieldSettingsDto.maxValue ?? null),
      (fieldSettings.minLength = updateFieldSettingsDto.minLength ?? null),
      (fieldSettings.maxLength = updateFieldSettingsDto.maxLength ?? null),
      (fieldSettings.minDate = updateFieldSettingsDto.minDate ?? null),
      (fieldSettings.maxDate = updateFieldSettingsDto.maxDate ?? null),
      (fieldSettings.minAmount = updateFieldSettingsDto.minAmount ?? null),
      (fieldSettings.maxAmount = updateFieldSettingsDto.maxAmount ?? null),
      (fieldSettings.year = updateFieldSettingsDto.year ?? null),
      (fieldSettings.hasLink = updateFieldSettingsDto.hasLink ?? null),
      (fieldSettings.url = updateFieldSettingsDto.url ?? null),
      (fieldSettings.buttonText = updateFieldSettingsDto.buttonText ?? null),
      (fieldSettings.hasPropertyInput =
        updateFieldSettingsDto.hasPropertyInput ?? null),
      (fieldSettings.hasPropertyList =
        updateFieldSettingsDto.hasPropertyList ?? null),
      (fieldSettings.listType = updateFieldSettingsDto.listType ?? null),
      (fieldSettings.fileTypes = updateFieldSettingsDto.fileTypes ?? null),
      (fieldSettings.fileMaxSize = updateFieldSettingsDto.fileMaxSize ?? null),
      (fieldSettings.maxFiles = updateFieldSettingsDto.maxFiles ?? null),
      (fieldSettings.timeInterval = updateFieldSettingsDto.timeInterval ?? null)
  }

  mapFieldTypeToFieldSettingsDto(
    fieldSettings: FieldSettings | null | undefined,
    fieldType: string,
  ): FieldSettingsDto {
    switch (fieldType) {
      case 'textbox':
        return {
          maxLength: fieldSettings ? fieldSettings.maxLength : null,
          minLength: fieldSettings ? fieldSettings.minLength : null,
        } as TextboxFieldSettingsDto
      case 'numberbox':
        return {
          maxLength: fieldSettings ? fieldSettings.maxLength : null,
          minLength: fieldSettings ? fieldSettings.minLength : null,
          maxValue: fieldSettings ? fieldSettings.maxValue : null,
          minValue: fieldSettings ? fieldSettings.minValue : null,
        } as NumberboxFieldSettingsDto
      case 'message':
        return {
          hasLink: fieldSettings ? fieldSettings.hasLink : null,
          url: fieldSettings ? fieldSettings.url : null,
          buttonText: fieldSettings ? fieldSettings.buttonText : null,
        } as MessageFieldSettingsDto
      case 'datePicker':
        return {
          minDate: fieldSettings ? fieldSettings.minDate : null,
          maxDate: fieldSettings ? fieldSettings.maxDate : null,
        } as DatePickerFieldSettingsDto
      case 'dropdownList':
        return {
          list: fieldSettings?.list
            ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettings.list)
            : '',
          listType: fieldSettings?.listType ? fieldSettings.listType : '',
        } as DropdownListFieldSettingsDto
      case 'radioButtons':
        return {
          list: fieldSettings?.list
            ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettings.list)
            : null,
        } as RadioButtonsFieldSettingsDto
      case 'iskNumberbox':
        return {
          minAmount: fieldSettings ? fieldSettings.minAmount : null,
          maxAmount: fieldSettings ? fieldSettings.maxAmount : null,
        } as IskNumberboxFieldSettingsDto
      case 'propertyNumber':
        return {
          hasPropertyInput: fieldSettings
            ? fieldSettings.hasPropertyInput
            : null,
          hasPropertyList: fieldSettings ? fieldSettings.hasPropertyList : null,
        } as PropertyNumberFieldSettingsDto
      case 'document':
        return {
          fileTypes: fieldSettings ? fieldSettings.fileTypes : null,
          fileMaxSize: fieldSettings ? fieldSettings.fileMaxSize : null,
          maxFiles: fieldSettings ? fieldSettings.maxFiles : null,
        } as DocumentFieldSettingsDto
      case 'timeInput':
        return {
          timeInterval: fieldSettings ? fieldSettings.timeInterval : null,
        } as TimeInputFieldSettingsDto
      default:
        return {}
    }
  }
}
