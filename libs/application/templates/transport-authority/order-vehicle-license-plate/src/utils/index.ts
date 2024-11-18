import { OrderVehicleLicensePlate } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { YES } from '@island.is/application/core'
import {
  Application,
  ChargeCodeItem,
  ExtraData,
  StaticText,
} from '@island.is/application/types'
import { payment } from '../lib/messages'

export { getSelectedVehicle } from './getSelectedVehicle'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  const answers = application.answers as OrderVehicleLicensePlate
  return getChargeCodeItemsWithAnswers(answers)
}

export const getChargeCodeItemsWithAnswers = (
  answers: OrderVehicleLicensePlate,
): Array<ChargeCodeItem> => {
  return getChargeCodeItemsWithExtraLabelUsingAnswers(answers).map((item) => ({
    code: item.chargeItemCode,
    quantity: item.chargeItemQuantity,
  }))
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as OrderVehicleLicensePlate
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}

export enum PlateType {
  front = 'front',
  rear = 'rear',
}

export const getChargeCodeItemsWithExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: StaticText
}> => {
  const answers = application.answers as OrderVehicleLicensePlate
  return getChargeCodeItemsWithExtraLabelUsingAnswers(answers)
}

const getChargeCodeItemsWithExtraLabelUsingAnswers = (
  answers: OrderVehicleLicensePlate,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: StaticText
}> => {
  const result: Array<{
    chargeItemCode: string
    chargeItemQuantity?: number
    extraLabel?: StaticText
  }> = []

  if (answers?.plateSize?.frontPlateSize?.length > 0) {
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
      extraLabel: payment.paymentChargeOverview.frontLabel,
    })
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_SGS.toString(),
      extraLabel: payment.paymentChargeOverview.frontLabel,
    })
  }

  if (answers?.plateSize?.rearPlateSize?.length > 0) {
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE.toString(),
      extraLabel: payment.paymentChargeOverview.rearLabel,
    })
    result.push({
      chargeItemCode:
        ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_SGS.toString(),
      extraLabel: payment.paymentChargeOverview.rearLabel,
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
