import {
  Application,
  ChargeCodeItem,
  ExtraData,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { OrderVehicleRegistrationCertificateAnswers } from '..'

export { getSelectedVehicle } from './getSelectedVehicle'

export const getChargeCodeItems = (): Array<ChargeCodeItem> => {
  return [
    {
      code: ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE.toString(),
    },
  ]
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers =
    application.answers as OrderVehicleRegistrationCertificateAnswers
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
