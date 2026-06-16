import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'
import { ApplicationAnswers } from '../lib/dataSchema'
import * as m from '../lib/messages'

const formatDateStr = (dateStr: string | undefined): string =>
  dateStr ? format(new Date(dateStr), 'dd.MM.yyyy') : ''

const getOptionLabel = (
  options: Array<{ id?: string; name?: string }> | undefined,
  value: string | undefined,
): string => options?.find((option) => option.id === value)?.name ?? value ?? ''

const getPaymentFrequencyLabel = (frequency: string | undefined) => {
  if (frequency === 'oneTime') {
    return m.application.oneTimePayment
  }
  if (frequency === 'monthly') {
    return m.application.monthlyPayment
  }
  return frequency ?? ''
}

const incomeTypeLabelMap = {
  casualWork: m.application.incomeTypeCasualWork,
  partTime: m.application.incomeTypePartTime,
  contractWork: m.application.incomeTypeContractWork,
  pension: m.application.incomeTypePension,
  capitalIncome: m.application.incomeTypeCapitalIncome,
  socialInsurance: m.application.incomeTypeSocialInsurance,
} as const

const buildEntryHeading = (index: number, total: number): KeyValueItem[] =>
  total > 1
    ? [
        {
          width: 'full',
          keyText: {
            ...m.application.overviewEntryHeading,
            values: { index: index + 1 },
          },
          lineAboveKeyText: index > 0,
        },
      ]
    : []

export const getIncomeTypeOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const types = getValueViaPath<string[]>(answers, 'typeOfIncome') ?? []

  return [
    {
      width: 'full',
      keyText: m.application.overviewIncomeTypeLabel,
      valueText: types.map(
        (type) =>
          incomeTypeLabelMap[type as keyof typeof incomeTypeLabelMap] ?? type,
      ),
    },
  ]
}

export const getCasualWorkOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerCasualWork']>>(
      answers,
      'registerCasualWork',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'half',
      keyText: m.application.overviewNationalId,
      valueText: formatKennitala(entry.company.nationalId),
    },
    {
      width: 'half',
      keyText: m.application.overviewCompany,
      valueText: entry.company.name ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: m.application.monthFrom,
      valueText: formatDateStr(entry.monthFrom),
    },
    {
      width: 'half',
      keyText: m.application.monthTo,
      valueText: formatDateStr(entry.monthTo),
    },
    {
      width: 'half',
      keyText: m.application.overviewEstimatedAmount,
      valueText: formatCurrency(entry.estimatedIncome),
    },
  ])
}

export const getPartTimeOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerPartTime']>>(
      answers,
      'registerPartTime',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'half',
      keyText: m.application.overviewNationalId,
      valueText: formatKennitala(entry.company.nationalId),
    },
    {
      width: 'half',
      keyText: m.application.overviewCompany,
      valueText: entry.company.name ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: m.application.jobStart,
      valueText: formatDateStr(entry.jobStart),
    },
    {
      width: 'half',
      keyText: m.application.workPercentage,
      valueText: `${entry.workPercentage}%`,
    },
    {
      width: 'half',
      keyText: m.application.overviewEstimatedAmount,
      valueText: formatCurrency(entry.estimatedIncome),
    },
  ])
}

export const getContractWorkOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerContractWork']>>(
      answers,
      'registerContractWork',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'half',
      keyText: m.application.overviewContractWorkStart,
      valueText: formatDateStr(entry.contractJobStart),
    },
    {
      width: 'half',
      keyText: m.application.overviewContractWorkEnd,
      valueText: formatDateStr(entry.workEnds),
    },
  ])
}

export const getPensionOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerPension']>>(
      answers,
      'registerPension',
    ) ?? []
  const pensionFunds =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'pensionFunds.data',
    ) ?? []
  const pensionTypes =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'incomeTypes.data.pensionTypes',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'full',
      keyText: m.application.pensionFund,
      valueText: getOptionLabel(pensionFunds, entry.pensionFund),
    },
    {
      width: 'half',
      keyText: m.application.overviewType,
      valueText: getOptionLabel(pensionTypes, entry.pensionType),
    },
    {
      width: 'half',
      keyText: m.application.overviewAmountPerMonth,
      valueText: formatCurrency(entry.amountPerMonth),
    },
  ])
}

export const getCapitalIncomeOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerCapitalIncome']>>(
      answers,
      'registerCapitalIncome',
    ) ?? []
  const capitalIncomeTypes =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'incomeTypes.data.capitalIncomeTypes',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'full',
      keyText: m.application.overviewCapitalIncomeType,
      valueText: getOptionLabel(capitalIncomeTypes, entry.paymentType),
    },
    {
      width: 'half',
      keyText: m.application.overviewCapitalIncomeAmount,
      valueText: formatCurrency(entry.amountPerMonth),
    },
    {
      width: 'half',
      keyText: m.application.paymentFrequency,
      valueText: getPaymentFrequencyLabel(entry.paymentFrequency),
    },
  ])
}

export const getSocialInsuranceOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries =
    getValueViaPath<NonNullable<ApplicationAnswers['registerSocialInsurance']>>(
      answers,
      'registerSocialInsurance',
    ) ?? []
  const socialInsuranceTypes =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'incomeTypes.data.trTypes',
    ) ?? []

  return entries.flatMap((entry, index) => [
    ...buildEntryHeading(index, entries.length),
    {
      width: 'full',
      keyText: m.application.overviewSocialInsuranceType,
      valueText: getOptionLabel(socialInsuranceTypes, entry.socialPaymentType),
    },
    {
      width: 'half',
      keyText: m.application.overviewSocialInsuranceAmount,
      valueText: formatCurrency(entry.amountPerMonth),
    },
    {
      width: 'half',
      keyText: m.application.paymentFrequency,
      valueText: getPaymentFrequencyLabel(entry.paymentFrequency),
    },
  ])
}
