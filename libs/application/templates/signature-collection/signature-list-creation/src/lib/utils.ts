import { formatPhoneNumber } from '@island.is/application/ui-components'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatPhone = (phone: string) => {
  return formatPhoneNumber(phone.replace(/(^00354|^\+354|\D)/g, ''))
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}
