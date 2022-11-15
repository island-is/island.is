import { OrderVehicleLicensePlate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: OrderVehicleLicensePlate,
): Array<string> => {
  if (!answers.includeRushFee) {
    return [
      ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
    ]
  } else {
    return [
      ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_WITH_RUSH_FEE.toString(),
    ]
  }
}
