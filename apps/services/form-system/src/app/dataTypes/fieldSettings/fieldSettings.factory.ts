import { FieldTypesEnum } from '@island.is/form-system/shared'
import { FieldSettings } from './fieldSettings.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

export class FieldSettingsFactory {
  static getClass(type: string, fieldSettings: FieldSettings | undefined) {
    if (!fieldSettings) {
      return undefined
    }
    let keys: string[]
    switch (type) {
      case FieldTypesEnum.TEXTBOX:
        keys = ['minLength', 'maxLength', 'isLarge']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.NUMBERBOX:
        keys = ['minValue', 'maxValue']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.MESSAGE:
        keys = ['hasLink', 'url', 'buttonText']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.DATE_PICKER:
        keys = ['minDate', 'maxDate']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.DROPDOWN_LIST:
        keys = ['listType']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.ISK_NUMBERBOX:
        keys = ['minAmount', 'maxAmount']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.PROPERTY_NUMBER:
        keys = ['hasPropertyInput', 'hasPropertyList']
        return this.pickSettings(fieldSettings, keys)
      case FieldTypesEnum.FILE:
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
