import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export * from './getChargeItemCodes'

export const staticData = (application: Application) => {
  const participantsFromAnswers = getValueViaPath(
    application.answers,
    'participantList',
    [],
  ) as Array<Record<string, string>>

  console.log('participantsFromAnswers', participantsFromAnswers)
  return participantsFromAnswers
}
