import { ChangeOperatorOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (
  answers: ChangeOperatorOfVehicle,
): Array<string> => {
  const operatorWasAdded = !!answers.operators?.find((x) => x.wasAdded)
  const operatorWasRemoved = !!answers.removed?.wasRemoved

  const result = []

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
