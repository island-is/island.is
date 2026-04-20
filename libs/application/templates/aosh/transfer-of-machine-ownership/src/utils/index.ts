import { ChargeItemCode } from '@island.is/shared/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Application,
  BasicChargeItem,
  FormValue,
} from '@island.is/application/types'
import { TransferOfMachineOwnershipAnswers } from '..'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'
export { getReviewSteps } from './getReviewSteps'
export * from './getReviewers'
export { getApproveAnswers } from './getApproveAnswers'
export { getRejecter } from './getRejecter'
export { doSellerAndBuyerHaveSameNationalId } from './doSellerAndBuyerHaveSameNationalId'

export const getChargeItems = (
  application: Application<FormValue>,
): Array<BasicChargeItem> => {
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  if (answers.machine?.paymentRequiredForOwnerChange === false) {
    return []
  }

  return [
    { code: ChargeItemCode.AOSH_TRANSFER_OF_MACHINE_OWNERSHIP.toString() },
  ]
}
