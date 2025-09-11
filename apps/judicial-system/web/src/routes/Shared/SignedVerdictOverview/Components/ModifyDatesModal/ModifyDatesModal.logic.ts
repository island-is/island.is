import { IntlShape } from 'react-intl'

import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'

export const createCaseModifiedExplanation = (
  formatMessage: IntlShape['formatMessage'],
  previousExplanation: string | null | undefined,
  nextExplanation: string,
  userName?: string | null,
  userTitle?: string | null,
  institutionName?: string | null,
): string => {
  const now = new Date()
  const history = previousExplanation ? `${previousExplanation}<br/><br/>` : ''

  return `${history}${formatMessage(m.sections.modifyDatesInfo.explanation, {
    date: capitalize(formatDate(now, 'PPPP', true) || ''),
    time: formatDate(now, constants.TIME_FORMAT),
    userName: userName ?? '',
    userTitle: lowercase(userTitle),
    institutionName: institutionName ?? '',
    explanation: nextExplanation,
  })}`
}
