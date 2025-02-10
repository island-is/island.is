import { Application, BasicChargeItem } from '@island.is/application/types'
import { ChangeCoOwnerOfVehicle } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

import { ExtraData } from '@island.is/clients/charge-fjs-v2'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const answers = application.answers as ChangeCoOwnerOfVehicle
  return getChargeItemsWithAnswers(answers)
}

export const getChargeItemsWithAnswers = (
  answers: ChangeCoOwnerOfVehicle,
): Array<BasicChargeItem> => {
  const coOwnerWasAdded =
    answers.coOwners?.filter(({ wasRemoved }) => wasRemoved !== 'true').length >
    0
  const coOwnerWasRemoved = !!answers.ownerCoOwners?.find(
    (x) => x.wasRemoved === 'true',
  )

  const result: Array<BasicChargeItem> = []

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
