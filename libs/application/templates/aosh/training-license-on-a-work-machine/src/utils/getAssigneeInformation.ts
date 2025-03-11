import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getAssigneeOverviewInformation = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const companyName = getValueViaPath<string>(
    answers,
    'assigneeInformation.company.name',
  )
  const companyNationalId = getValueViaPath<string>(
    answers,
    'assigneeInformation.company.nationalId',
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
    {
      width: 'full',
      keyText: overview.labels.assignee,
      valueText: [
        {
          ...overview.assignee.companyName,
          values: {
            value: companyName,
          },
        },
        {
          ...overview.assignee.companyNationalId,
          values: {
            value: formatKennitala(companyNationalId ?? ''),
          },
        },
        {
          ...overview.assignee.assigneeName,
          values: {
            value: assigneeName,
          },
        },
        {
          ...overview.assignee.assigneeNationalId,
          values: {
            value: formatKennitala(assigneeNationalId ?? ''),
          },
        },
        {
          ...overview.assignee.assigneeEmail,
          values: {
            value: assigneeEmail,
          },
        },
        {
          ...overview.assignee.assigneePhone,
          values: {
            value: formatPhoneNumber(assigneePhone ?? ''),
          },
        },
      ],
    },
  ]
}
