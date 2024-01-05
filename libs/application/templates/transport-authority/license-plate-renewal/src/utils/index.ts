import { LicensePlateRenewal } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, ExtraData } from '@island.is/application/types'

export const getChargeItemCodeWithAnswers = (
  answers: LicensePlateRenewal,
): Array<string> => {
  const result = [
    ChargeItemCode.TRANSPORT_AUTHORITY_LICENSE_PLATE_RENEWAL.toString(),
  ]

  return result
}

export const getChargeItemCodes = (application: Application): Array<string> => {
  const answers = application.answers as LicensePlateRenewal
  return getChargeItemCodeWithAnswers(answers)
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as LicensePlateRenewal
  return [{ name: 'vehicle', value: answers?.pickPlate?.regno }]
}

export { getSelectedVehicle } from './getSelectedVehicle'
