import { LicensePlateRenewal } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  ExtraData,
  NationalRegistryIndividual,
} from '@island.is/application/types'

export const getChargeItemCodeWithAnswers = (
  application: Application,
): Array<string> => {
  const answers = application.answers as LicensePlateRenewal
  const nationalRegistryIndividual = application.externalData[
    'nationalRegistry '
  ].data as NationalRegistryIndividual
  const age = nationalRegistryIndividual.age
  if (age > 64) {
    return []
  }
  const result = [
    ChargeItemCode.TRANSPORT_AUTHORITY_LICENSE_PLATE_RENEWAL.toString(),
  ]

  return result
}

export const getChargeItemCodes = (application: Application): Array<string> => {
  return getChargeItemCodeWithAnswers(application)
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as LicensePlateRenewal
  return [{ name: 'vehicle', value: answers?.pickPlate?.regno }]
}

export { getSelectedVehicle } from './getSelectedVehicle'
