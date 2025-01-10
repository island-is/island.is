import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ChargeItemCode } from '@island.is/shared/constants'
import { BasicChargeItem } from '@island.is/application/types'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'

export const getChargeItems = (): Array<BasicChargeItem> => {
  return [
    { code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA102 },
    { code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA111 },
    { code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA113 },
    { code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA116 },
    { code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA117 },
  ]
}

export { AddressDeliveryType } from './../shared/types'
