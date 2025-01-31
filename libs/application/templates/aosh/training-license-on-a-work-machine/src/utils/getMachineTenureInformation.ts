import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { assigneeInformation, certificateOfTenure } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'
import { formatDate } from './formatDate'

export const getMachineTenureInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const machineNumber = getValueViaPath<string>(
    answers,
    'certificateOfTenure.machineNumber',
  )
  const machineType = getValueViaPath<string>(
    answers,
    'certificateOfTenure.machineType',
  )
  const dateFrom = getValueViaPath<string>(
    answers,
    'certificateOfTenure.dateFrom',
  )
  const dateTo = getValueViaPath<string>(answers, 'certificateOfTenure.dateTo')
  const tenureInHours = getValueViaPath<string>(
    answers,
    'certificateOfTenure.tenureInHours',
  )

  return [
    `${formatMessage(
      certificateOfTenure.labels.machineNumber,
    )}: ${machineNumber}`,
    `${formatMessage(certificateOfTenure.labels.machineType)}: ${machineType}`,
    `${formatMessage(
      certificateOfTenure.labels.tenureInHours,
    )}: ${tenureInHours}`,
    `${formatMessage(certificateOfTenure.labels.period)}: ${formatDate(
      dateFrom ?? '',
    )}-${formatDate(dateTo ?? '')}`,
  ].filter((n) => n)
}
