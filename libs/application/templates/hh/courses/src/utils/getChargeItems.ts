import { getValueViaPath } from '@island.is/application/core'
import type { Application, BasicChargeItem } from '@island.is/application/types'
import type { ApplicationAnswers } from '../lib/dataSchema'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const participantList =
    getValueViaPath<ApplicationAnswers['participantList']>(
      application.answers,
      'participantList',
    ) ?? []

  const selectedChargeItemCode = getValueViaPath<string>(
    application.externalData,
    'hhCoursesSelectedChargeItem.data.chargeItemCode',
  )

  const chargeItemCode = selectedChargeItemCode

  if (!chargeItemCode) return []

  return [
    {
      code: chargeItemCode,
      quantity: participantList.length,
    },
  ]
}
