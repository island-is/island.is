import {
  Application,
  ChargeCodeItem,
  ExtraData,
} from '@island.is/application/types'
import { ChangeOperatorOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  const answers = application.answers as ChangeOperatorOfVehicle
  return getChargeCodeItemsWithAnswers(answers)
}

export const getChargeCodeItemsWithAnswers = (
  answers: ChangeOperatorOfVehicle,
): Array<ChargeCodeItem> => {
  const operatorWasAdded =
    answers.operators?.filter(({ wasRemoved }) => wasRemoved !== 'true')
      .length > 0
  const operatorWasRemoved = !!answers.oldOperators?.find(
    (x) => x.wasRemoved === 'true',
  )

  const result: Array<ChargeCodeItem> = []

  if (operatorWasAdded) {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_ADD.toString(),
    })
  }

  if (operatorWasRemoved) {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_REMOVE.toString(),
    })
  }
  return result
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as ChangeOperatorOfVehicle
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
