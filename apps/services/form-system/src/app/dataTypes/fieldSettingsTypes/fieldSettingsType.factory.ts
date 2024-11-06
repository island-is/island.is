import { FieldTypes } from '../../enums/fieldTypes'
import { FieldSettingsType } from './fieldSettingsType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

export class FieldSettingsTypeFactory {
  static getClass(type: string, fieldSettingsType: FieldSettingsType) {
    let keys: string[]
    switch (type) {
      case FieldTypes.TEXTBOX:
        keys = ['minLength', 'maxLength', 'isLarge']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.NUMBERBOX:
        keys = ['minLength', 'maxLength', 'minValue', 'maxValue']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.MESSAGE:
        keys = ['hasLink', 'url', 'buttonText']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.DATE_PICKER:
        keys = ['minDate', 'maxDate']
        return this.pickSettings(fieldSettingsType, keys)
      // case FieldTypes.DROPDOWN_LIST: {
      //   keys = ['list', 'listType', 'isRequired']
      //   const dropdownListFieldSettings = this.pickSettings(fieldSettingsType, keys)
      //   dropdownListFieldSettings.list = fieldSettingsType?.list
      //     ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettingsType.list)
      //     : []
      //   return dropdownListFieldSettings
      // }
      // case FieldTypes.RADIO_BUTTONS: {
      //   keys = ['list', 'isRequired']
      //   const radioButtonsFieldSettings = this.pickSettings(fieldSettingsType, keys)
      //   radioButtonsFieldSettings.list = fieldSettingsType?.list
      //     ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettingsType.list)
      //     : []
      //   return radioButtonsFieldSettings
      // }
      case FieldTypes.ISK_NUMBERBOX:
        keys = ['minAmount', 'maxAmount']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.PROPERTY_NUMBER:
        keys = ['hasPropertyInput', 'hasPropertyList']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.DOCUMENT:
        keys = ['fileTypes', 'fileMaxSize', 'maxFiles']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.TIME_INPUT:
        keys = ['timeInterval']
        return this.pickSettings(fieldSettingsType, keys)
      case FieldTypes.HOMESTAY_OVERVIEW:
        keys = ['year']
        return this.pickSettings(fieldSettingsType, keys)
      default:
        return undefined
    }
  }

  private static pickSettings = (
    obj: FieldSettingsType,
    keys: string[],
    defaultValue = null,
  ): FieldSettingsType => {
    return defaults(
      pick(obj, keys),
      zipObject(keys, Array(keys.length).fill(defaultValue)),
    ) as FieldSettingsType
  }
}
