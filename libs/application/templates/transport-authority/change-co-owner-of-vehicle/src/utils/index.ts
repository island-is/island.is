import { ChangeCoOwnerOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: ChangeCoOwnerOfVehicle,
): Array<string> => {
  const coOwnerWasAdded = !!answers.coOwners.find((x) => x.wasAdded)
  const coOwnerWasRemoved = !!answers.coOwners.find((x) => x.wasRemoved)

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
