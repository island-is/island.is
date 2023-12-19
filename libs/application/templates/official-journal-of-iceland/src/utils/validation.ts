import { parsePhoneNumberFromString } from 'libphonenumber-js'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const isValidEmail = (email: string) => {
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  return parsePhoneNumberFromString(phone, 'IS')?.isValid() ?? false
}
