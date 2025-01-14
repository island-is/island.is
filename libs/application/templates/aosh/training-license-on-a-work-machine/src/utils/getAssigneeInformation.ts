import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { assigneeInformation } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const getAssigneeInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const companyNationalId = getValueViaPath<string>(
    answers,
    'assigneeInformation.companyNationalId',
  )
  const companyName = getValueViaPath<string>(
    answers,
    'assigneeInformation.companyName',
  )
  const assigneeNationalId = getValueViaPath<string>(
    answers,
    'assigneeInformation.assigneeNationalId',
  )
  const assigneeName = getValueViaPath<string>(
    answers,
    'assigneeInformation.assigneeName',
  )
  const assigneeEmail = getValueViaPath<string>(
    answers,
    'assigneeInformation.assigneeEmail',
  )
  const assigneePhone = getValueViaPath<string>(
    answers,
    'assigneeInformation.assigneePhone',
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
