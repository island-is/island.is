import { OrderVehicleLicensePlate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: OrderVehicleLicensePlate,
): Array<string> => {
  const result = [
    ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
    ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_SGS.toString(),
  ]

  if (answers.includeRushFee) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_RUSH_FEE.toString(),
    )
  }

  return result
}
