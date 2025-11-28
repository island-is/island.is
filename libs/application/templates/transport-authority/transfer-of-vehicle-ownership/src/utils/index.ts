import {
  Application,
  BasicChargeItem,
  ExtraData,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { TransferOfVehicleOwnershipAnswers } from '..'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatMileage = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export { getSelectedVehicle } from './getSelectedVehicle'
export { getReviewSteps } from './getReviewSteps'
export { canReviewerApprove, canReviewerReApprove } from './canReviewerApprove'
export { getApproveAnswers } from './getApproveAnswers'
export { isLastReviewer } from './isLastReviewer'
export { getRejecter } from './getRejecter'
export { getReviewers, getReviewerRole } from './getReviewers'
export * from './pendingAction'

export const getChargeItems = (): Array<BasicChargeItem> => {
  return [
    {
      code: ChargeItemCode.TRANSPORT_AUTHORITY_TRANSFER_OF_VEHICLE_OWNERSHIP.toString(),
    },
    { code: ChargeItemCode.TRANSPORT_AUTHORITY_TRAFFIC_SAFETY_FEE.toString() },
  ]
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
