import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { formatDate } from './formatDate'

export const getMachineTenureOverviewInformation = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
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
  const practicalRight = getValueViaPath<string>(
    answers,
    'certificateOfTenure.practicalRight',
  )

  return [
    {
      width: 'full',
      keyText: overview.labels.machineTenure,
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
            value: `${formatDate(dateFrom ?? '')}-${formatDate(dateTo ?? '')}`,
          },
        },
      ],
    },
  ]
}
