import { ChangeOperatorOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: ChangeOperatorOfVehicle,
): Array<string> => {
  const operatorWasAdded = !!answers.operators.find((x) => x.wasAdded)
  const operatorWasRemoved = !!answers.operators.find((x) => x.wasRemoved)

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
