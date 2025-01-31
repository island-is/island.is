import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { assigneeInformation } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getAssigneeInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const companyNationalId = getValueViaPath<string>(
    answers,
    'assigneeInformation.company.nationalId',
  )
  const companyName = getValueViaPath<string>(
    answers,
    'assigneeInformation.company.name',
  )
  const assigneeNationalId = getValueViaPath<string>(
    answers,
    'assigneeInformation.assignee.nationalId',
  )
  const assigneeName = getValueViaPath<string>(
    answers,
    'assigneeInformation.assignee.name',
  )
  const assigneeEmail = getValueViaPath<string>(
    answers,
    'assigneeInformation.assignee.email',
  )
  const assigneePhone = getValueViaPath<string>(
    answers,
    'assigneeInformation.assignee.phone',
  )

  return [
    `${formatMessage(assigneeInformation.labels.companyName)}: ${companyName}`,
    `${formatMessage(
      assigneeInformation.labels.companyNationalId,
    )}: ${formatKennitala(companyNationalId ?? '')}`,
    `${formatMessage(
      assigneeInformation.labels.assigneeName,
    )}: ${assigneeName}`,
    `${formatMessage(
      assigneeInformation.labels.assigneeNationalId,
    )}: ${formatKennitala(assigneeNationalId ?? '')}`,
    `${formatMessage(
      assigneeInformation.labels.assigneeEmail,
    )}: ${assigneeEmail}`,
    `${formatMessage(
      assigneeInformation.labels.assigneePhone,
    )}: ${formatPhoneNumber(assigneePhone ?? '')}`,
  ].filter((n) => n)
}
