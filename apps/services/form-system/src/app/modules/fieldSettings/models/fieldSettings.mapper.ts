import { Injectable } from '@nestjs/common'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { UpdateFieldSettingsDto } from './dto/updateFieldSettings.dto'
import { FieldSettings } from './fieldSettings.model'
import { FieldSettingsDto } from './dto/fieldSettings.dto'
import { ListItemMapper } from '../../listItems/models/listItem.mapper'
import { FieldTypes } from '../../../enums/fieldTypes'

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
    fieldSettings: FieldSettings | undefined | null,
    fieldType: string,
  ): FieldSettingsDto {
    let keys: string[]
    switch (fieldType) {
      case FieldTypes.TEXTBOX:
        keys = ['minLength', 'maxLength']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.NUMBERBOX:
        keys = ['minLength', 'maxLength', 'minValue', 'maxValue']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.MESSAGE:
        keys = ['hasLink', 'url', 'buttonText']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.DATE_PICKER:
        keys = ['minDate', 'maxDate']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.DROPDOWN_LIST: {
        keys = ['list', 'listType']
        const dropdownListFieldSettings = this.pickSettings(fieldSettings, keys)
        dropdownListFieldSettings.list = fieldSettings?.list
          ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettings.list)
          : []
        return dropdownListFieldSettings
      }
      case FieldTypes.RADIO_BUTTONS: {
        keys = ['list']
        const radioButtonsFieldSettings = this.pickSettings(fieldSettings, keys)
        radioButtonsFieldSettings.list = fieldSettings?.list
          ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettings.list)
          : []
        return radioButtonsFieldSettings
      }
      case FieldTypes.ISK_NUMBERBOX:
        keys = ['minAmount', 'maxAmount']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.PROPERTY_NUMBER:
        keys = ['hasPropertyInput', 'hasPropertyList']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.DOCUMENT:
        keys = ['fileTypes', 'fileMaxSize', 'maxFiles']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypes.TIME_INPUT:
        keys = ['timeInterval']
        return this.pickSettings(fieldSettings, keys)
      default:
        return {}
    }
  }

  private pickSettings = (
    obj: FieldSettings | undefined | null,
    keys: string[],
    defaultValue = null,
  ): FieldSettingsDto => {
    return defaults(
      pick(obj, keys),
      zipObject(keys, Array(keys.length).fill(defaultValue)),
    ) as FieldSettingsDto
  }
}
