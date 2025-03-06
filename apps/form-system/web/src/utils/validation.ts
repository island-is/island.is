import { ApplicationState, FieldTypesEnum } from "@island.is/form-system/ui"
import { FormSystemField } from "@island.is/api/schema"


export const validateScreen = (
  state: ApplicationState
): string[] => {

  const { currentScreen } = state
  if (!currentScreen) return []
  const { data, index } = currentScreen
  const requiredFields = data?.fields?.filter((field) => field?.isRequired)



  return []
}

const hasError = (
  field: FormSystemField
): boolean => {
  const { fieldType } = field
  const value = field?.values?.[0]?.json
  if (!value) return true
  switch (fieldType) {
    case FieldTypesEnum.CHECKBOX: {
      return !value?.checkboxValue
    }
    case FieldTypesEnum.BANK_ACCOUNT: {
      return !validateBanknumber(value?.bankAccount ?? '')
    }
    case FieldTypesEnum.TEXTBOX: {
      if (value.text === '' || !value.text) return true
    }
    case FieldTypesEnum.EMAIL: {
      return !validateEmail(value?.email ?? '')
    }
    case FieldTypesEnum.PHONE_NUMBER: {
      return !validatePhoneNumber(value?.phoneNumber ?? '')
    }
    case FieldTypesEnum.NATIONAL_ID: {
      return !validateNationalId(value?.nationalId ?? '', value?.name ?? '')
    }
    default: {
      return false
    }
  }
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

const validatePhoneNumber = (value?: string) => {
  if (!value) return false
  const phoneNumberRegex = /^\d{3}-\d{4}$/
  return phoneNumberRegex.test(value)
}

const validateNationalId = (nationalId?: string, name?: string) => {
  if (!nationalId || !name) return false
  const nationalIdRegex = /^\d{6}-\d{4}$/
  if (!nationalIdRegex.test(nationalId)) return false
  if (name.length < 2) return false
  return true
}