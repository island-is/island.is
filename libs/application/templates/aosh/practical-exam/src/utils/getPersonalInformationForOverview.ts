import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { shared } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const getPersonalInformationForOverview = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'information.name')

  return [
    `${formatMessage(shared.labels.name)}: ${applicantName}`,
    `${formatMessage(shared.labels.ssn)}: ${formatKennitala(
      applicantNationalId ?? '',
    )}`,
  ].filter((n) => n)
}
