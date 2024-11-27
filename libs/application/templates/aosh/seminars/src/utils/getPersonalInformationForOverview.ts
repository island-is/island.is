import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { personal } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const getPersonalInformationForOverview = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'applicant.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'applicant.name')

  return [
    `${formatMessage(personal.labels.userName)}: ${applicantName}`,
    `${formatMessage(personal.labels.userNationalId)}: ${formatKennitala(
      applicantNationalId ?? '',
    )}`,
  ].filter((n) => n)
}
