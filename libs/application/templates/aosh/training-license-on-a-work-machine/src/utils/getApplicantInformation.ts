import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { information } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getApplicantInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
  isAssignee?: boolean,
) => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'information.name')
  const applicantAddress = getValueViaPath<string>(
    answers,
    'information.address',
  )
  const applicantPostCode = getValueViaPath<string>(
    answers,
    'information.postCode',
  )
  const applicantEmail = getValueViaPath<string>(answers, 'information.email')
  const applicantPhone = getValueViaPath<string>(answers, 'information.phone')

  return isAssignee
    ? [
        `${formatMessage(information.labels.name)}: ${applicantName}`,
        `${formatMessage(information.labels.nationalId)}: ${formatKennitala(
          applicantNationalId ?? '',
        )}`,
      ].filter((n) => n)
    : [
        `${formatMessage(information.labels.name)}: ${applicantName}`,
        `${formatMessage(information.labels.nationalId)}: ${formatKennitala(
          applicantNationalId ?? '',
        )}`,
        `${formatMessage(information.labels.address)}: ${applicantAddress}`,
        `${formatMessage(information.labels.postCode)}: ${applicantPostCode}`,
        `${formatMessage(information.labels.email)}: ${applicantEmail}`,
        `${formatMessage(information.labels.phone)}: ${formatPhoneNumber(
          applicantPhone ?? '',
        )}`,
      ].filter((n) => n)
}
