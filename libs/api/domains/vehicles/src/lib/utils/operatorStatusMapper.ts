import { OperatorAnonymityStatus } from '../models/getVehicleSearch.model'

export const operatorStatusMapper = (
  names: string[] | undefined | null,
  allOperatorsAreAnonymous: boolean,
  someOperatorsAreAnonymous: boolean,
): OperatorAnonymityStatus => {
  if (allOperatorsAreAnonymous) {
    return OperatorAnonymityStatus.ALL
  }

  if (someOperatorsAreAnonymous && names?.length) {
    return OperatorAnonymityStatus.SOME
  }

  return OperatorAnonymityStatus.UNKNOWN
}
