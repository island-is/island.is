import { ChargeItemCode } from '@island.is/shared/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'
export { getReviewSteps } from './getReviewSteps'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getApproveAnswers } from './getApproveAnswers'
export { getRejecter } from './getRejecter'

export const getChargeItemCodes = (): Array<string> => {
  return [ChargeItemCode.AOSH_TRANSFER_OF_MACHINE_OWNERSHIP.toString()]
}
