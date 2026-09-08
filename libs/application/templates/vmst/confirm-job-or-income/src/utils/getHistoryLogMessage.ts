import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { application as applicationMessages } from '../lib/messages'

export const getHistoryLogMessage = (application: Application) => {
  const casualDateFrom = getValueViaPath<string>(
    application.answers,
    'registerCasualWork[0].dateFrom',
  )
  const casualDateTo = getValueViaPath<string>(
    application.answers,
    'registerCasualWork[0].dateTo',
  )
  const contractJobStart = getValueViaPath<string>(
    application.answers,
    'registerContractWork[0].contractJobStart',
  )
  const workEnds = getValueViaPath<string>(
    application.answers,
    'registerContractWork[0].workEnds',
  )

  const dateFrom = casualDateFrom || contractJobStart
  const dateTo = casualDateTo || workEnds

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

  return {
    ...applicationMessages.historyLogReceivedForPeriod,
    values: { dateFrom: formattedFrom, dateTo: formattedTo },
  }
}
