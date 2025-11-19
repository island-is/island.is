import { FormSystemField, FormSystemValue } from '@island.is/api/schema'
import { FieldTypesEnum } from './enums'

type FieldTypeMapping = {
  [FieldTypesEnum.TEXTBOX]: {
    text?: FormSystemValue['text']
  }
  [FieldTypesEnum.EMAIL]: {
    email?: FormSystemValue['email']
  }
  [FieldTypesEnum.PHONE_NUMBER]: {
    phoneNumber?: FormSystemValue['phoneNumber']
  }
  [FieldTypesEnum.NATIONAL_ID]: {
    nationalId?: FormSystemValue['nationalId']
    name?: FormSystemValue['name']
  }
  [FieldTypesEnum.BANK_ACCOUNT]: {
    bankAccount?: FormSystemValue['bankAccount']
  }
  [FieldTypesEnum.ISK_NUMBERBOX]: {
    iskNumber?: FormSystemValue['iskNumber']
  }
  [FieldTypesEnum.DATE_PICKER]: {
    date?: FormSystemValue['date']
  }
  [FieldTypesEnum.CHECKBOX]: {
    checkboxValue?: FormSystemValue['checkboxValue']
  }
  [FieldTypesEnum.RADIO_BUTTONS]: {
    listValue?: FormSystemValue['listValue']
  }
  [FieldTypesEnum.DROPDOWN_LIST]: {
    listValue?: FormSystemValue['listValue']
  }
  [FieldTypesEnum.TIME_INPUT]: {
    time?: FormSystemValue['time']
  }
  [FieldTypesEnum.MESSAGE]: {
    text?: FormSystemValue['text']
  }
  [FieldTypesEnum.PROPERTY_NUMBER]: {
    propertyNumber?: FormSystemValue['propertyNumber']
    address?: FormSystemValue['address']
    municipality?: FormSystemValue['municipality']
    postalCode?: FormSystemValue['postalCode']
  }
  [FieldTypesEnum.FILE]: {
    s3Key?: FormSystemValue['s3Key']
    s3Url?: FormSystemValue['s3Url']
  }
  [FieldTypesEnum.NUMBERBOX]: {
    number?: FormSystemValue['number']
  }
  [FieldTypesEnum.ISK_SUMBOX]: {
    iskNumber?: FormSystemValue['iskNumber']
  }
  [FieldTypesEnum.PAYER]: {
    name?: FormSystemValue['name']
    nationalId?: FormSystemValue['nationalId']
  }
  [FieldTypesEnum.PAYMENT]: {
    paymentCode?: FormSystemValue['paymentCode']
  }
  [FieldTypesEnum.APPLICANT]: {
    name?: FormSystemValue['name']
    nationalId?: FormSystemValue['nationalId']
  }
}

const getInitialJsonForField = <T extends keyof FieldTypeMapping>(
  fieldType: T,
): FieldTypeMapping[T] => {
  switch (fieldType) {
    case FieldTypesEnum.TEXTBOX:
      return { text: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.EMAIL:
      return { email: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.PHONE_NUMBER:
      return { phoneNumber: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.NATIONAL_ID:
      return { nationalId: undefined, name: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.BANK_ACCOUNT:
      return { bankAccount: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.ISK_NUMBERBOX:
      return { iskNumber: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.DATE_PICKER:
      return { date: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.CHECKBOX:
      return { checkboxValue: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.RADIO_BUTTONS:
      return { listValue: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.DROPDOWN_LIST:
      return { listValue: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.TIME_INPUT:
      return { time: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.MESSAGE:
      return { text: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.PROPERTY_NUMBER:
      return {
        propertyNumber: undefined,
        address: undefined,
        municipality: undefined,
        postalCode: undefined,
      } as FieldTypeMapping[T]
    case FieldTypesEnum.FILE:
      return { s3Key: undefined, s3Url: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.NUMBERBOX:
      return { number: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.PAYER:
      return { name: undefined, nationalId: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.PAYMENT:
      return { paymentCode: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.ISK_SUMBOX:
      return { iskNumber: undefined } as FieldTypeMapping[T]
    case FieldTypesEnum.APPLICANT:
      return { name: undefined, nationalId: undefined } as FieldTypeMapping[T]
    default:
      throw new Error(`Field type ${fieldType} not supported`)
  }
}

const removeNullProperties = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> =>
  (Object.entries(obj) as [keyof T, unknown][]).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key as keyof T] = value as T[keyof T]
    }
    return acc
  }, {} as Partial<T>)

export const initializeField = (field: FormSystemField): FormSystemField => {
  const defaultJson = getInitialJsonForField(
    field.fieldType as keyof FieldTypeMapping,
  )
  const existingValue = (field.values && field.values[0]) || {}
  const cleanedJson = removeNullProperties(existingValue.json || {})
  const mergedJson = { ...defaultJson, ...cleanedJson }
  const updatedValue = { ...existingValue, json: mergedJson }
  return { ...field, values: [updatedValue] }
}
