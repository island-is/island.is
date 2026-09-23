import { ExternalData, FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO,
  GaldurExternalDomainModelsIncomeContractorJobDTO,
  GaldurExternalDomainModelsIncomeIrregularJobDTO,
  GaldurExternalDomainModelsIncomePartTimeJobDTO,
  GaldurExternalDomainModelsIncomePensionPaymentDTO,
  GaldurExternalDomainModelsIncomeTRPaymentDTO,
  GaldurExternalDomainRequestsIncomeCreateCapitalIncomePaymentRequest,
  GaldurExternalDomainRequestsIncomeCreateContractorJobRequest,
  GaldurExternalDomainRequestsIncomeCreateIncomesRequest,
  GaldurExternalDomainRequestsIncomeCreateIrregularJobRequest,
  GaldurExternalDomainRequestsIncomeCreatePartTimeJobRequest,
  GaldurExternalDomainRequestsIncomeCreatePensionPaymentRequest,
  GaldurExternalDomainRequestsIncomeCreateTRPaymentRequest,
} from '@island.is/clients/vmst-unemployment'
import {
  buildEmployerSSNDelete,
  reconcile,
} from '@island.is/application/templates/vmst/confirm-job-or-income'
import { IncomeType } from './confirm-job-or-income.types'

type Entry = Record<string, unknown> & {
  company?: { nationalId?: string }
  isRemoved?: boolean
}

const getEntries = (answers: FormValue, fieldId: string): Entry[] =>
  (getValueViaPath<Entry[]>(answers, fieldId, []) ?? []).filter(
    (entry) => !entry.isRemoved,
  )

const getPersisted = <T>(externalData: ExternalData, path: string): T[] =>
  getValueViaPath<T[]>(externalData, path, []) ?? []

const toDate = (value: unknown): Date | undefined =>
  typeof value === 'string' && value ? new Date(value) : undefined

const toNumber = (value: unknown): number | undefined =>
  typeof value === 'string' && value ? Number(value) : undefined

const getNationalId = (entry: Entry): string | undefined =>
  entry.company?.nationalId?.replace(/-/g, '')

const getPeriodTo = (entry: Entry): Date | null | undefined =>
  entry.paymentFrequency === 'oneTime' ? toDate(entry.dateTo) : null

const buildIrregularJob = (entry: Entry) => ({
  employerSSN: getNationalId(entry),
  periodFrom: toDate(entry.dateFrom),
  periodTo: toDate(entry.dateTo),
  estimatedIncome: toNumber(entry.estimatedIncome),
  workShiftPeriodIds:
    typeof entry.workshiftPeriod === 'string'
      ? [entry.workshiftPeriod]
      : undefined,
})

const buildIrregularJobs = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreateIrregularJobRequest[] =>
  reconcile(
    getEntries(answers, 'registerCasualWork'),
    getPersisted<GaldurExternalDomainModelsIncomeIrregularJobDTO>(
      externalData,
      'income.data.irregularJobs',
    ),
    buildIrregularJob,
    'validationId',
    buildEmployerSSNDelete,
  )

const buildPartTimeJob = (entry: Entry) => ({
  employerSSN: getNationalId(entry),
  periodFrom: toDate(entry.jobStart),
  periodTo: toDate(entry.jobEnd),
  ratio: toNumber(entry.workPercentage),
  estimatedIncome: toNumber(entry.estimatedIncome),
})

const buildPartTimeJobs = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreatePartTimeJobRequest[] =>
  reconcile(
    getEntries(answers, 'registerPartTime'),
    getPersisted<GaldurExternalDomainModelsIncomePartTimeJobDTO>(
      externalData,
      'income.data.partTimeJobs',
    ),
    buildPartTimeJob,
    'validationId',
    buildEmployerSSNDelete,
  )

const buildContractorJob = (entry: Entry) => ({
  periodFrom: toDate(entry.contractJobStart),
  periodTo: toDate(entry.workEnds),
})

const buildContractorJobs = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreateContractorJobRequest[] =>
  reconcile(
    getEntries(answers, 'registerContractWork'),
    getPersisted<GaldurExternalDomainModelsIncomeContractorJobDTO>(
      externalData,
      'income.data.contractorJobs',
    ),
    buildContractorJob,
  )

const buildCapitalIncomePayment = (entry: Entry) => ({
  incomeTypeId:
    typeof entry.paymentType === 'string' ? entry.paymentType : undefined,
  estimatedIncome: toNumber(entry.amountPerMonth),
  periodFrom: toDate(entry.dateFrom),
  periodTo: getPeriodTo(entry),
})

const buildCapitalIncomePayments = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreateCapitalIncomePaymentRequest[] =>
  reconcile(
    getEntries(answers, 'registerCapitalIncome'),
    getPersisted<GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO>(
      externalData,
      'income.data.capitalIncomePayments',
    ),
    buildCapitalIncomePayment,
  )

const buildTRPayment = (entry: Entry) => ({
  incomeTypeId:
    typeof entry.socialPaymentType === 'string'
      ? entry.socialPaymentType
      : undefined,
  estimatedIncome: toNumber(entry.amountPerMonth),
  periodFrom: toDate(entry.dateFrom),
  periodTo: getPeriodTo(entry),
})

const buildTRPayments = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreateTRPaymentRequest[] =>
  reconcile(
    getEntries(answers, 'registerSocialInsurance'),
    getPersisted<GaldurExternalDomainModelsIncomeTRPaymentDTO>(
      externalData,
      'income.data.trPayments',
    ),
    buildTRPayment,
  )

const buildPensionPayment = (entry: Entry) => ({
  incomeTypeId:
    typeof entry.pensionType === 'string' ? entry.pensionType : undefined,
  pensionFundId:
    typeof entry.pensionFund === 'string' ? entry.pensionFund : undefined,
  estimatedIncome: toNumber(entry.amountPerMonth),
  periodFrom: toDate(entry.dateFrom),
  periodTo: getPeriodTo(entry),
})

const buildPensionPayments = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreatePensionPaymentRequest[] =>
  reconcile(
    getEntries(answers, 'registerPension'),
    getPersisted<GaldurExternalDomainModelsIncomePensionPaymentDTO>(
      externalData,
      'income.data.pensionPayments',
    ),
    buildPensionPayment,
  )

export const buildCreateIncomesRequest = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsIncomeCreateIncomesRequest => {
  const selectedIncomeTypes = new Set(
    getValueViaPath<IncomeType[]>(answers, 'typeOfIncome', []) ?? [],
  )

  return {
    irregularJobs: selectedIncomeTypes.has(IncomeType.CASUAL_WORK)
      ? buildIrregularJobs(answers, externalData)
      : undefined,
    partTimeJobs: selectedIncomeTypes.has(IncomeType.PART_TIME)
      ? buildPartTimeJobs(answers, externalData)
      : undefined,
    contractorJobs: selectedIncomeTypes.has(IncomeType.CONTRACT_WORK)
      ? buildContractorJobs(answers, externalData)
      : undefined,
    capitalIncomePayments: selectedIncomeTypes.has(IncomeType.CAPITAL_INCOME)
      ? buildCapitalIncomePayments(answers, externalData)
      : undefined,
    trPayments: selectedIncomeTypes.has(IncomeType.SOCIAL_INSURANCE)
      ? buildTRPayments(answers, externalData)
      : undefined,
    pensionPayments: selectedIncomeTypes.has(IncomeType.PENSION)
      ? buildPensionPayments(answers, externalData)
      : undefined,
  }
}
