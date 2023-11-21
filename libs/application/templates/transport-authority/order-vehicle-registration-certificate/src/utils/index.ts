import { Application, ExtraData } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { OrderVehicleRegistrationCertificateAnswers } from '..'

export { getSelectedVehicle } from './getSelectedVehicle'

export const getChargeItemCodes = (): Array<string> => {
  return [
    ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE.toString(),
  ]
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers =
    application.answers as OrderVehicleRegistrationCertificateAnswers
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
