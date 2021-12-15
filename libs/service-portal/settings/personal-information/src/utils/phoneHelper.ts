import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const parseNumber = (tel: string) => {
  const phoneNumber = parsePhoneNumberFromString(tel, 'IS')
  if (phoneNumber?.isValid()) {
    return phoneNumber.nationalNumber as string
  }
  return ''
}
