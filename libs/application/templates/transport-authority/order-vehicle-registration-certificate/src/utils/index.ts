import { OrderVehicleRegistrationCertificate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: OrderVehicleRegistrationCertificate,
): Array<string> => {
  if (answers.includeRushFee) {
    return [
      ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE.toString(),
    ]
  } else {
    return [
      ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE_WITH_RUSH_FEE.toString(),
    ]
  }
}
