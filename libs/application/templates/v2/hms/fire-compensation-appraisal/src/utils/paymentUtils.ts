import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (application: Application) => {
  const amount = getValueViaPath<number>(
    application.externalData,
    'calculateAmount.data',
  )

  return [{ code: ChargeItemCode.FIRE_COMPENSATION_APPRAISAL, amount }]
}
