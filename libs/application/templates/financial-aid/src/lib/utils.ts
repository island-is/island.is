import { parsePhoneNumberFromString } from 'libphonenumber-js'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
