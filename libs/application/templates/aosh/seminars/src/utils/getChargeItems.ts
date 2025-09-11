import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'
import { Participant } from '../shared/types'
import { isApplyingForMultiple } from './isApplyingForMultiple'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const codeFromVer = getValueViaPath<string>(
    application.externalData,
    'seminar.data.feeCodeDirectPayment',
  )
  const participantList =
    getValueViaPath<Participant[]>(application.answers, 'participantList') ?? []
  const userIsApplyingForMultiple = isApplyingForMultiple(application.answers)
  return [
    {
      code: codeFromVer || '',
      quantity: userIsApplyingForMultiple ? participantList.length : 1,
    },
  ]
}
