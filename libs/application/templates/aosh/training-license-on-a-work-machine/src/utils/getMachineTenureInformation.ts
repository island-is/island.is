import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { assigneeInformation, certificateOfTenure } from '../lib/messages'
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
  console.log(licenseCategoryPrefix, licenseCategories, licenseCategory)

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
