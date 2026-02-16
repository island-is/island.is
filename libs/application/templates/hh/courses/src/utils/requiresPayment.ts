import { getValueViaPath } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import { HAS_CHARGE_ITEM_CODE } from './constants'

export const requiresPayment = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const hasChargeFromAnswers = getValueViaPath<boolean>(
    answers,
    HAS_CHARGE_ITEM_CODE,
  )

  if (hasChargeFromAnswers !== undefined) {
    return hasChargeFromAnswers
  }

  return !!getValueViaPath(
    externalData,
    'hhCoursesSelectedChargeItem.data.chargeItemCode',
  )
}
