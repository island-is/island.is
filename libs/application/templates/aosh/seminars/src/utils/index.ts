import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export * from './getChargeItemCodes'

export const staticData = (application: Application) => {
  const participantsFromAnswers = getValueViaPath(
    application.answers,
    'participantList',
    [],
  ) as Array<Record<string, string>>

  return participantsFromAnswers
}
export * from './isIndividual'
export * from './isCompany'
