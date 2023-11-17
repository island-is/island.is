import { Application, ExtraData } from '@island.is/application/types'
import { ChangeOperatorOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (application: Application): Array<string> => {
  const answers = application.answers as ChangeOperatorOfVehicle
  return getChargeItemCodeWithAnswers(answers)
}

export const getChargeItemCodeWithAnswers = (
  answers: ChangeOperatorOfVehicle,
): Array<string> => {
  const operatorWasAdded =
    answers.operators?.filter(({ wasRemoved }) => wasRemoved !== 'true')
      .length > 0
  const operatorWasRemoved = !!answers.oldOperators?.find(
    (x) => x.wasRemoved === 'true',
  )

  const result: Array<string> = []

  if (operatorWasAdded) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_ADD.toString(),
    )
  }

  if (operatorWasRemoved) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_REMOVE.toString(),
    )
  }
  return result
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as ChangeOperatorOfVehicle
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
