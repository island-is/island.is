import { ChangeCoOwnerOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (
  answers: ChangeCoOwnerOfVehicle,
): Array<string> => {
  const coOwnerWasAdded = answers.coOwners?.length > 0
  const coOwnerWasRemoved = !!answers.ownerCoOwners?.find((x) => x.wasRemoved)

  const result = []

  if (coOwnerWasAdded) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_ADD.toString(),
    )
  }

  if (coOwnerWasRemoved) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_REMOVE.toString(),
    )
  }

  return result
}
