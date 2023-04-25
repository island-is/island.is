import { LicensePlateRenewal } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: LicensePlateRenewal,
): Array<string> => {
  const result = [
    ChargeItemCode.TRANSPORT_AUTHORITY_LICENSE_PLATE_RENEWAL.toString(),
  ]

  return result
}

export { getSelectedVehicle } from './getSelectedVehicle'
