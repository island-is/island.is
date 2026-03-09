import { EMAIL_REGEX } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export { getSelectedMachine } from './getSelectedMachine'
export { isContactDifferentFromApplicant } from './isContactDifferentFromApplicant'
