import { FieldTypesEnum } from '../fieldTypes/fieldTypes.enum'
import { FieldSettings } from './fieldSettings.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

export class FieldSettingsFactory {
  static getClass(type: string, fieldSettings: FieldSettings) {
    let keys: string[]
    switch (type) {
      case FieldTypesEnum.TEXTBOX:
        keys = ['minLength', 'maxLength', 'isLarge']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.NUMBERBOX:
        keys = ['minLength', 'maxLength', 'minValue', 'maxValue']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.MESSAGE:
        keys = ['hasLink', 'url', 'buttonText']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.DATE_PICKER:
        keys = ['minDate', 'maxDate']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.DROPDOWN_LIST: {
        keys = ['listType']
        return this.pickSettings(fieldSettings, keys)
        // const dropdownListFieldSettings = this.pickSettings(fieldSettingsType, keys)
        // dropdownListFieldSettings.list = fieldSettingsType?.list
        //   ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettingsType.list)
        //   : []
        // return dropdownListFieldSettings
      }
      // case FieldTypes.RADIO_BUTTONS: {
      //   keys = ['list', 'isRequired']
      //   const radioButtonsFieldSettings = this.pickSettings(fieldSettingsType, keys)
      //   radioButtonsFieldSettings.list = fieldSettingsType?.list
      //     ? this.listItemMapper.mapListItemsToListItemsDto(fieldSettingsType.list)
      //     : []
      //   return radioButtonsFieldSettings
      // }
      case FieldTypesEnum.ISK_NUMBERBOX:
        keys = ['minAmount', 'maxAmount']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.PROPERTY_NUMBER:
        keys = ['hasPropertyInput', 'hasPropertyList']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.DOCUMENT:
        keys = ['fileTypes', 'fileMaxSize', 'maxFiles']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.TIME_INPUT:
        keys = ['timeInterval']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.HOMESTAY_OVERVIEW:
        keys = ['year']
        return this.pickSettings(fieldSettings, keys)
      default:
        return undefined
    }
  }

  private static pickSettings = (
    obj: FieldSettings,
    keys: string[],
    defaultValue = null,
  ): FieldSettings => {
    return defaults(
      pick(obj, keys),
      zipObject(keys, Array(keys.length).fill(defaultValue)),
    ) as FieldSettings
  }
}
