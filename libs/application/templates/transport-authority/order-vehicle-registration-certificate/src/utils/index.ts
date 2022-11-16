import { OrderVehicleRegistrationCertificate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

// export { getSelectedVehicle } from './getSelectedVehicle'

export const getChargeItemCodes = (
  answers: OrderVehicleRegistrationCertificate,
): Array<string> => {
  return [
    ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE.toString(),
  ]
}
