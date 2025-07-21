import { parsePhoneNumberFromString } from 'libphonenumber-js'

// TODO(balli): Remove if unused
export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
