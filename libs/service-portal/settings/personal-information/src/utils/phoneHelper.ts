import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const parseNumber = (tel: string) => {
  const phoneNumber = parsePhoneNumberFromString(tel, 'IS')
  if (phoneNumber?.isValid()) {
    return phoneNumber.nationalNumber as string
  }
  return ''
}

export const parseFullNumber = (tel: string) => {
  const mobileNumber = tel.replace(/\s/g, '')
  if (mobileNumber.length === 7) {
    return parseNumber(mobileNumber)
  }
  return mobileNumber
}
