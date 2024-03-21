import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'

export const getChargeItemCodes = (): Array<string> => {
  return [ChargeItemCode.AOSH_STREET_REGISTRATION.toString()]
}

export { AddressDeliveryType } from './../shared/types'
