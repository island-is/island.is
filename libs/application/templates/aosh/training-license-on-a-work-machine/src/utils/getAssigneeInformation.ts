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
import { getUserInfo } from './getUserInfo'

export const getAssigneeOverviewInformation = (
  answers: FormValue,
  _externalData: ExternalData,
  userNationalId: string,
  isAssignee?: boolean,
): Array<KeyValueItem> => {
  const assigneeInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
  >(answers, 'assigneeInformation')
  const userInfo = getUserInfo(answers, userNationalId)

  return (
    assigneeInformation
      ?.filter(({ assignee }) =>
        isAssignee
          ? userInfo?.assignee?.nationalId &&
            assignee.nationalId === userInfo.assignee.nationalId
          : true,
      )
      .map(({ company, assignee, workMachine }, index) => ({
        width: 'full',
        keyText: {
          ...overview.labels.assignee,
          values: {
            value: isAssignee ? '' : index + 1,
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
          !isAssignee && {
            ...overview.assignee.workMachines,
            values: {
              value: workMachine?.map((x) => x.split(' ')[0]).join(', '),
            },
          },
        ],
      })) ?? []
  )
}
