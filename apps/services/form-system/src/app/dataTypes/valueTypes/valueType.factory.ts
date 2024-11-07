import { FieldTypesEnum } from '../fieldTypes/fieldTypes.enum'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { ValueType } from './valueType.model'

export class ValueTypeFactory {
  static getClass(type: string, valueType: ValueType) {
    let keys: string[]
    switch (type) {
      case FieldTypesEnum.TEXTBOX:
        keys = ['text']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.NUMBERBOX:
        keys = ['number']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.MESSAGE:
        keys = ['text']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.HOMESTAY_OVERVIEW:
        keys = ['year', 'isNullReport', 'months', 'totalAmount', 'totalDays']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.HOMESTAY_NUMBER:
        keys = ['homestayNumber']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.CANDITATE:
        keys = [
          'kennitala',
          'name',
          'address',
          'postalCode',
          'municipality',
          'jobTitle',
          'altName',
        ]
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.DATE_PICKER:
        keys = ['date']
        return this.pickSettings(valueType, keys)
      default:
        return undefined
    }
  }

  private static pickSettings = (
    obj: ValueType,
    keys: string[],
    defaultValue = null,
  ): ValueType => {
    return defaults(
      pick(obj, keys),
      zipObject(keys, Array(keys.length).fill(defaultValue)),
    ) as ValueType
  }
}
