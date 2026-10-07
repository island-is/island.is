import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/shared/utils'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'
import { ApplicationAnswers } from '../lib/dataSchema'
import * as m from '../lib/messages'
import { PaymentFrequency } from './constants'
import {
  getPersistedRecords,
  toCapitalIncomeRow,
  toCasualWorkRow,
  toContractWorkRow,
  toPartTimeRow,
  toPensionRow,
  toSocialInsuranceRow,
} from './persistedRows'
import { splitPersisted } from './reconcile'

const formatDateStr = (dateStr: string | undefined): string =>
  dateStr ? format(new Date(dateStr), 'dd.MM.yyyy') : ''

const getOptionLabel = (
  options: Array<{ id?: string; name?: string }> | undefined,
  value: string | undefined,
): string => options?.find((option) => option.id === value)?.name ?? value ?? ''

const getPaymentFrequencyLabel = (frequency: string | undefined) => {
  if (frequency === PaymentFrequency.ONE_TIME) {
    return m.application.oneTimePayment
  }
  if (frequency === PaymentFrequency.MONTHLY) {
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

type EntryStatus = 'new' | 'removed'

type DiffedEntry<TRow> = { entry: TRow; status: EntryStatus }

// Deleted rows are stripped from the answers the moment the repeater screen is
// submitted, so the only record of a deletion is a persisted id that no longer
// appears in the answers. Unchanged rows are intentionally left out entirely.
const getDiffedEntries = <TPersisted extends { id?: string }, TRow>(
  answers: FormValue,
  externalData: ExternalData,
  answersPath: string,
  persistedPath: string,
  toRow: (record: TPersisted) => TRow,
): Array<DiffedEntry<TRow>> => {
  const entries = getValueViaPath<TRow[]>(answers, answersPath) ?? []
  const persisted = getPersistedRecords<TPersisted>(externalData, persistedPath)

  const { creates, removedRecords } = splitPersisted(
    entries as Array<TRow & { isRemoved?: boolean }>,
    persisted,
  )

  return [
    ...creates.map((entry) => ({
      entry: entry as TRow,
      status: 'new' as const,
    })),
    ...removedRecords.map((record) => ({
      entry: toRow(record),
      status: 'removed' as const,
    })),
  ]
}

const buildEntryHeading = (
  index: number,
  status: EntryStatus,
): KeyValueItem[] => [
  {
    width: 'full',
    keyText: {
      ...m.application.overviewEntryHeading,
      values: { index: index + 1 },
    },
    lineAboveKeyText: index > 0,
    tag: {
      label:
        status === 'new'
          ? m.application.overviewTagNew
          : m.application.overviewTagDeleted,
      variant: status === 'new' ? 'blue' : 'red',
      outlined: true,
    },
  },
]

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
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerCasualWork',
    'income.data.irregularJobs',
    toCasualWorkRow,
  ) as Array<
    DiffedEntry<NonNullable<ApplicationAnswers['registerCasualWork']>[number]>
  >

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
      keyText: m.application.dateFrom,
      valueText: formatDateStr(entry.dateFrom),
    },
    {
      width: 'half',
      keyText: m.application.dateTo,
      valueText: formatDateStr(entry.dateTo),
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
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerPartTime',
    'income.data.partTimeJobs',
    toPartTimeRow,
  ) as Array<
    DiffedEntry<NonNullable<ApplicationAnswers['registerPartTime']>[number]>
  >

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerContractWork',
    'income.data.contractorJobs',
    toContractWorkRow,
  ) as Array<
    DiffedEntry<NonNullable<ApplicationAnswers['registerContractWork']>[number]>
  >

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerPension',
    'income.data.pensionPayments',
    toPensionRow,
  ) as Array<
    DiffedEntry<NonNullable<ApplicationAnswers['registerPension']>[number]>
  >
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

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerCapitalIncome',
    'income.data.capitalIncomePayments',
    toCapitalIncomeRow,
  ) as Array<
    DiffedEntry<
      NonNullable<ApplicationAnswers['registerCapitalIncome']>[number]
    >
  >
  const capitalIncomeTypes =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'incomeTypes.data.capitalIncomeTypes',
    ) ?? []

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
  const entries = getDiffedEntries(
    answers,
    externalData,
    'registerSocialInsurance',
    'income.data.trPayments',
    toSocialInsuranceRow,
  ) as Array<
    DiffedEntry<
      NonNullable<ApplicationAnswers['registerSocialInsurance']>[number]
    >
  >
  const socialInsuranceTypes =
    getValueViaPath<Array<{ id?: string; name?: string }>>(
      externalData,
      'incomeTypes.data.trTypes',
    ) ?? []

  return entries.flatMap(({ entry, status }, index) => [
    ...buildEntryHeading(index, status),
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
