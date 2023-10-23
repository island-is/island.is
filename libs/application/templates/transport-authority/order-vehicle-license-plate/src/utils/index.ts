import { OrderVehicleLicensePlate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { YES } from '@island.is/application/core'
import { Application, ExtraData } from '@island.is/application/types'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export { getSelectedVehicle } from './getSelectedVehicle'

export const getChargeItemCodes = (applicaiton: Application): Array<string> => {
  const answers = applicaiton.answers as OrderVehicleLicensePlate
  return getChargeItemCodesWithAnswers(answers)
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as OrderVehicleLicensePlate
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}

export const getChargeItemCodesWithAnswers = (
  answers: OrderVehicleLicensePlate,
): Array<string> => {
  return getChargeItemCodesWithInfo(answers).map((x) => x.chargeItemCode)
}

export enum PlateType {
  front = 'front',
  rear = 'rear',
}

export const getChargeItemCodesWithInfo = (
  answers: OrderVehicleLicensePlate,
): Array<{ chargeItemCode: string; type?: PlateType }> => {
  const result: Array<{ chargeItemCode: string; type?: PlateType }> = []

  if (answers?.plateSize?.frontPlateSize?.length > 0) {
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
      type: PlateType.front,
    })
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_SGS.toString(),
      type: PlateType.front,
    })
  }

  if (answers?.plateSize?.rearPlateSize?.length > 0) {
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
      type: PlateType.rear,
    })
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_SGS.toString(),
      type: PlateType.rear,
    })
  }

  const includeRushFee =
    answers.plateDelivery?.includeRushFee?.includes(YES) || false
  if (result.length > 0 && includeRushFee) {
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_RUSH_FEE.toString(),
    })
  }

  return result
}
