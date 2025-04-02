import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export const getAssigneeOverviewInformation = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const assigneeInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
  >(answers, 'assigneeInformation')

  return (
    assigneeInformation?.companyAndAssignee?.map(
      ({ company, assignee, workMachine }, index) => ({
        width: 'full',
        keyText: {
          ...overview.labels.assignee,
          values: {
            value: index + 1,
          },
        },
        valueText: [
          {
            ...overview.assignee.companyName,
            values: {
              value: company.name,
            },
          },
          {
            ...overview.assignee.companyNationalId,
            values: {
              value: formatKennitala(company.nationalId ?? ''),
            },
          },
          {
            ...overview.assignee.assigneeName,
            values: {
              value: assignee.name,
            },
          },
          {
            ...overview.assignee.assigneeNationalId,
            values: {
              value: formatKennitala(assignee.nationalId ?? ''),
            },
          },
          {
            ...overview.assignee.assigneeEmail,
            values: {
              value: assignee.email,
            },
          },
          {
            ...overview.assignee.assigneePhone,
            values: {
              value: formatPhoneNumber(assignee.phone ?? ''),
            },
          },
          {
            ...overview.assignee.workMachines,
            values: {
              value: workMachine.join(', '),
            },
          },
        ],
      }),
    ) ?? []
  )
}
