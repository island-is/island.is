import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return Boolean(phone && phone.isValid())
}
