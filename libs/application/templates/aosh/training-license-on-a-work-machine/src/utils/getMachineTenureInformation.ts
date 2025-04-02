import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { formatDate } from './formatDate'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export const getMachineTenureOverviewInformation = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const certificateOfTenure = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
  >(answers, 'certificateOfTenure')

  return (
    certificateOfTenure?.map(
      ({
        machineNumber,
        machineType,
        dateFrom,
        dateTo,
        tenureInHours,
        practicalRight,
      }) => ({
        width: 'full',
        keyText: machineType,
        valueText: [
          {
            ...overview.certificateOfTenure.machineNumber,
            values: {
              value: machineNumber,
            },
          },
          {
            ...overview.certificateOfTenure.machineType,
            values: {
              value: machineType,
            },
          },
          {
            ...overview.certificateOfTenure.practicalRight,
            values: {
              value: practicalRight,
            },
          },
          {
            ...overview.certificateOfTenure.tenureInHours,
            values: {
              value: tenureInHours,
            },
          },
          {
            ...overview.certificateOfTenure.period,
            values: {
              value: `${formatDate(dateFrom ?? '')}-${formatDate(
                dateTo ?? '',
              )}`,
            },
          },
        ],
      }),
    ) ?? []
  )
}
