import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import {
  assigneeInformation,
  certificateOfTenure,
  overview,
} from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'
import { formatDate } from './formatDate'
import { MachineLicenseCategoryDto } from '@island.is/clients/work-machines'

export const getMachineTenureInformation = (
  answers: FormValue,
  externalData: ExternalData,
  lang: 'en' | 'is',
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
  const licenseCategoryPrefix = getValueViaPath<string>(
    answers,
    'certificateOfTenure.licenseCategoryPrefix',
  )
  const licenseCategories = getValueViaPath<MachineLicenseCategoryDto[]>(
    externalData,
    'licenses.data.licenseCategories',
    [],
  )
  const licenseCategory = licenseCategories?.find(
    (category) => category.categoryPrefix === licenseCategoryPrefix,
  )

  return [
    `${formatMessage(
      certificateOfTenure.labels.machineNumber,
    )}: ${machineNumber}`,
    `${formatMessage(certificateOfTenure.labels.machineType)}: ${machineType}`,
    `${formatMessage(certificateOfTenure.labels.practicalRight)}: ${
      lang === 'is'
        ? licenseCategory?.categoryName
        : licenseCategory?.categoryNameEn
    }`,
    `${formatMessage(
      certificateOfTenure.labels.tenureInHours,
    )}: ${tenureInHours}`,
    `${formatMessage(certificateOfTenure.labels.period)}: ${formatDate(
      dateFrom ?? '',
    )}-${formatDate(dateTo ?? '')}`,
  ].filter((n) => n)
}

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
