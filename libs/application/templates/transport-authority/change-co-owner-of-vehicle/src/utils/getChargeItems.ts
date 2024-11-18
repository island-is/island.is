import { Application, ChargeCodeItem } from '@island.is/application/types'
import { ChangeCoOwnerOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

import { ExtraData } from '@island.is/clients/charge-fjs-v2'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  const answers = application.answers as ChangeCoOwnerOfVehicle
  return getChargeCodeItemsWithAnswers(answers)
}

export const getChargeCodeItemsWithAnswers = (
  answers: ChangeCoOwnerOfVehicle,
): Array<ChargeCodeItem> => {
  const coOwnerWasAdded =
    answers.coOwners?.filter(({ wasRemoved }) => wasRemoved !== 'true').length >
    0
  const coOwnerWasRemoved = !!answers.ownerCoOwners?.find(
    (x) => x.wasRemoved === 'true',
  )

  const result: Array<ChargeCodeItem> = []

  if (coOwnerWasAdded) {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_ADD.toString(),
    })
  }

  if (coOwnerWasRemoved) {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_REMOVE.toString(),
    })
  }

  return result
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as ChangeCoOwnerOfVehicle
  return [{ name: 'vehicle', value: answers?.pickVehicle?.plate }]
}
