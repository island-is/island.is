import { FieldTypesEnum } from '@island.is/form-system/shared'
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
      case FieldTypesEnum.CANDIDATE:
        keys = [
          'nationalId',
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
      case FieldTypesEnum.DROPDOWN_LIST:
        keys = ['listValue']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.RADIO_BUTTONS:
        keys = ['listValue']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.EMAIL:
        keys = ['email']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.PROPERTY_NUMBER:
        keys = ['propertyNumber', 'address', 'postalCode', 'municipality']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.ISK_NUMBERBOX:
        keys = ['iskNumber']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.ISK_SUMBOX:
        keys = ['iskNumber']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.CHECKBOX:
        keys = ['checkboxValue']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.PAYER:
        keys = ['nationalId', 'name']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.NATIONAL_ID:
        keys = ['nationalId', 'name']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.NATIONAL_ID_ESTATE:
        keys = ['nationalId', 'name']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.NATIONAL_ID_ALL:
        keys = ['nationalId', 'name']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.PHONE_NUMBER:
        keys = ['phoneNumber']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.BANK_ACCOUNT:
        keys = ['bankAccount']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.TIME_INPUT:
        keys = ['time']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.FILE:
        keys = ['s3Key', 's3Url']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.PAYMENT:
        keys = ['paymentCode']
        return this.pickSettings(valueType, keys)
      case FieldTypesEnum.APPLICANT:
        keys = [
          'nationalId',
          'name',
          'address',
          'postalCode',
          'municipality',
          'email',
          'phoneNumber',
          'delegationType',
        ]
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
