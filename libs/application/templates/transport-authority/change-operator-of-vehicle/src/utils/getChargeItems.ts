import {
  Application,
  BasicChargeItem,
  ExtraData,
} from '@island.is/application/types'
import { ChangeOperatorOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const answers = application.answers as ChangeOperatorOfVehicle
  return getChargeItemsWithAnswers(answers)
}

export const getChargeItemsWithAnswers = (
  answers: ChangeOperatorOfVehicle,
): Array<BasicChargeItem> => {
  const operatorWasAdded =
    answers.operators?.filter(({ wasRemoved }) => wasRemoved !== 'true')
      .length > 0
  const operatorWasRemoved = !!answers.oldOperators?.find(
    (x) => x.wasRemoved === 'true',
  )

  const result: Array<BasicChargeItem> = []

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
