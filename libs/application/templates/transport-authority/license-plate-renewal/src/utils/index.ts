import { LicensePlateRenewal } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, ExtraData } from '@island.is/application/types'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodeWithAnswers = (
  answers: LicensePlateRenewal,
): Array<string> => {
  const result = [
    ChargeItemCode.TRANSPORT_AUTHORITY_LICENSE_PLATE_RENEWAL.toString(),
  ]

  return result
}

export const getChargeItemCodes = (applicaiton: Application): Array<string> => {
  const answers = applicaiton.answers as LicensePlateRenewal
  return getChargeItemCodeWithAnswers(answers)
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as LicensePlateRenewal
  return [{ name: 'vehicle', value: answers?.pickPlate?.regno }]
}

export { getSelectedVehicle } from './getSelectedVehicle'
