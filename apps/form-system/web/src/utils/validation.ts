import { ApplicationState, FieldTypesEnum } from '@island.is/form-system/ui'
import { FormSystemField, FormSystemValue } from '@island.is/api/schema'
import { AssetTypes } from '@island.is/form-system/enums'

export const validateScreen = (state: ApplicationState): string[] => {
  const { currentScreen } = state
  if (!currentScreen) return []
  const { data } = currentScreen
  const requiredFields = data?.fields?.filter((field) => field?.isRequired)
  const errors =
    requiredFields
      ?.filter(
        (field): field is FormSystemField => field !== null && hasError(field),
      )
      .map((field) => field.id) ?? []

  return errors
}

export const hasError = (field: FormSystemField, valueIndex = 0): boolean => {
  const { fieldType } = field
  const value = field?.values?.[valueIndex]?.json as FormSystemValue
  if (!value) return true

  switch (fieldType) {
    case FieldTypesEnum.CHECKBOX:
      return !value?.checkboxValue
    case FieldTypesEnum.BANK_ACCOUNT:
      return !validateBanknumber(value?.bankAccount ?? '')
    case FieldTypesEnum.TEXTBOX:
      return value.text === '' || !value.text
    case FieldTypesEnum.NUMBERBOX:
      return !value?.number || isNaN(value.number)
    case FieldTypesEnum.EMAIL:
      return !validateEmail(value?.email ?? '')
    case FieldTypesEnum.PHONE_NUMBER:
      return value?.phoneNumber === '' || !value.phoneNumber
    case FieldTypesEnum.NATIONAL_ID:
      return !validateNationalId(value?.nationalId ?? '', value?.name ?? '')
    case FieldTypesEnum.ISK_NUMBERBOX:
      return !value?.iskNumber || value?.iskNumber.length === 0
    case FieldTypesEnum.PROPERTY_NUMBER:
      return !validatePropertyNumber(value)
    case FieldTypesEnum.ASSETS:
      if (!field.fieldSettings?.assetType) return false
      return !validateAssetFields(value, field.fieldSettings?.assetType)
    case FieldTypesEnum.RADIO_BUTTONS:
      return !value?.label?.is
    case FieldTypesEnum.DROPDOWN_LIST:
      return !value?.label?.is
    case FieldTypesEnum.DATE_PICKER:
      return !value?.date
    case FieldTypesEnum.TIME_INPUT:
      return !value?.time
    case FieldTypesEnum.FILE:
      return !value?.s3Key || value.s3Key.length === 0
    default:
      return false
  }
}

const validateLanguageType = (
  value?: { is?: string | null; en?: string | null } | null,
) => {
  if (!value) return false
  return !!value.is && !!value.en
}

const validateBanknumber = (value?: string) => {
  if (!value) return false
  const parts = value.split('-')
  if (parts.length !== 3) return false
  if (parts[0].length !== 4) return false
  if (parts[1].length !== 2) return false
  if (parts[2].length !== 6) return false
  return true
}

const validateEmail = (value?: string) => {
  if (!value) return false
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(value)
}

// TODO: Currently only validates nationalId, needs implementation once connection has been made to the national registry
const validateNationalId = (nationalId?: string, name?: string) => {
  // if (!nationalId || !name) return false
  if (!nationalId || !name) return false
  const nationalIdRegex = /^\d{6}-\d{4}$/

  if (!nationalIdRegex.test(nationalId)) return false
  // if (name.length < 2) return false
  return true
}

const validateAssetFields = (value: FormSystemValue, assetType: string) => {
  switch (assetType) {
    case AssetTypes.VEHICLE:
      return validateVehicleFields(value)
    case AssetTypes.REAL_ESTATE:
      return validatePropertyNumber(value)
    default:
      return true
  }
}

const validateVehicleFields = (value: FormSystemValue) => {
  const { registrationNumber, model, color } = value
  if (!registrationNumber || !model || !color) return false
  if (registrationNumber.length === 0 || model.length === 0) return false
  return validateLanguageType(color)
}

const validatePropertyNumber = (value: FormSystemValue) => {
  const { propertyNumber, address, municipality } = value
  return (
    !propertyNumber ||
    !address ||
    !municipality ||
    propertyNumber === '' ||
    address === '' ||
    municipality === ''
  )
}
