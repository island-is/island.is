import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'

export const getChargeItemCodes = (): Array<string> => {
  return [
    ChargeItemCode.AOSH_STREET_REGISTRATION_SA102,
    ChargeItemCode.AOSH_STREET_REGISTRATION_SA111,
    ChargeItemCode.AOSH_STREET_REGISTRATION_SA113,
    ChargeItemCode.AOSH_STREET_REGISTRATION_SA116,
    ChargeItemCode.AOSH_STREET_REGISTRATION_SA117,
  ]
}

export { AddressDeliveryType } from './../shared/types'
