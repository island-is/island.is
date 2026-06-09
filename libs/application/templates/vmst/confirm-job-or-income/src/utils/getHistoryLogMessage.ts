import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { application as applicationMessages } from '../lib/messages'

export const getHistoryLogMessage = (application: Application) => {
  const monthFrom = getValueViaPath<string>(
    application.answers,
    'registerCasualWork[0].monthFrom',
  )
  const monthTo = getValueViaPath<string>(
    application.answers,
    'registerCasualWork[0].monthTo',
  )
  const contractJobStart = getValueViaPath<string>(
    application.answers,
    'registerContractWork[0].contractJobStart',
  )
  const workEnds = getValueViaPath<string>(
    application.answers,
    'registerContractWork[0].workEnds',
  )

  const dateFrom = monthFrom || contractJobStart
  const dateTo = monthTo || workEnds

  if (!dateFrom || !dateTo) {
    return applicationMessages.historyLogSubmitted
  }

  const formattedFrom = new Date(dateFrom).toLocaleDateString('is-IS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTo = new Date(dateTo).toLocaleDateString('is-IS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `Tilkynning móttekin fyrir tímabil: ${formattedFrom} - ${formattedTo}`
}
