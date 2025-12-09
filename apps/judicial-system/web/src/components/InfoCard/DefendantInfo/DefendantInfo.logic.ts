import { IntlShape } from 'react-intl'

import { formatDate } from '@island.is/judicial-system/formatters'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './DefendantInfo.strings'

export const getAppealExpirationInfo = ({
  verdictAppealDeadline,
  isVerdictAppealDeadlineExpired,
  serviceRequirement,
}: {
  verdictAppealDeadline?: Date | string | null
  isVerdictAppealDeadlineExpired?: boolean | null
  serviceRequirement?: ServiceRequirement | null
}) => {
  if (serviceRequirement === ServiceRequirement.NOT_REQUIRED) {
    return { message: strings.serviceNotRequired, date: null }
  }

  if (!verdictAppealDeadline) {
    return { message: strings.appealDateNotBegun, date: null }
  }

  const expiryDate = new Date(verdictAppealDeadline)

  const message = isVerdictAppealDeadlineExpired
    ? strings.appealDateExpired
    : strings.appealExpirationDate

  return { message, date: formatDate(expiryDate) }
}

export const getVerdictViewDateText = (
  formatMessage: IntlShape['formatMessage'],
  verdictViewDate?: string | null,
): string => {
  if (verdictViewDate) {
    return formatMessage(strings.verdictDisplayedDate, {
      date: formatDate(verdictViewDate, 'PPP'),
    })
  } else {
    return formatMessage(strings.serviceRequired)
  }
}
