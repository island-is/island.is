import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import {
  GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO,
  GaldurExternalDomainModelsIncomeContractorJobDTO,
  GaldurExternalDomainModelsIncomeIrregularJobDTO,
  GaldurExternalDomainModelsIncomePartTimeJobDTO,
  GaldurExternalDomainModelsIncomePensionPaymentDTO,
  GaldurExternalDomainModelsIncomeTRPaymentDTO,
} from '@island.is/clients/vmst-unemployment'
import { INCOME_TYPE_ANSWER_KEYS } from './constants'

// Maps the persisted Galdur records into the answer row shape. Used both to seed
// the table repeaters and to render rows the user deleted in the overview.

export const toCasualWorkRow = (
  job: GaldurExternalDomainModelsIncomeIrregularJobDTO,
) => ({
  validationId: job.id,
  company: {
    nationalId: job.employerSSN ?? '',
    name: job.employerName?.trim() ?? '',
  },
  dateFrom: job.periodFrom ?? '',
  dateTo: job.periodTo ?? '',
  estimatedIncome:
    job.estimatedIncome != null ? String(job.estimatedIncome) : '',
  workshiftPeriod: job.workShiftPeriodIds?.[0] ?? '',
})

export const toPartTimeRow = (
  job: GaldurExternalDomainModelsIncomePartTimeJobDTO,
) => ({
  validationId: job.id,
  company: {
    nationalId: job.employerSSN ?? '',
    name: job.employerName?.trim() ?? '',
  },
  jobStart: job.periodFrom ?? '',
  jobEnd: job.periodTo ?? '',
  workPercentage: job.ratio != null ? String(job.ratio) : '',
  estimatedIncome:
    job.estimatedIncome != null ? String(job.estimatedIncome) : '',
})

export const toContractWorkRow = (
  job: GaldurExternalDomainModelsIncomeContractorJobDTO,
) => ({
  validationId: job.id,
  contractJobStart: job.startDate ?? '',
  workEnds: job.endDate ?? '',
})

export const toPensionRow = (
  payment: GaldurExternalDomainModelsIncomePensionPaymentDTO,
) => ({
  validationId: payment.id,
  pensionType: payment.incomeTypeId ?? '',
  pensionFund: payment.pensionFundId ?? '',
  amountPerMonth:
    payment.estimatedIncome != null ? String(payment.estimatedIncome) : '',
  dateFrom: payment.periodFrom ?? '',
  dateTo: payment.periodTo ?? '',
})

export const toCapitalIncomeRow = (
  payment: GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO,
) => ({
  validationId: payment.id,
  paymentType: payment.incomeTypeId ?? '',
  amountPerMonth:
    payment.estimatedIncome != null ? String(payment.estimatedIncome) : '',
  dateFrom: payment.periodFrom ?? '',
  dateTo: payment.periodTo ?? '',
})

export const toSocialInsuranceRow = (
  payment: GaldurExternalDomainModelsIncomeTRPaymentDTO,
) => ({
  validationId: payment.id,
  socialPaymentType: payment.incomeTypeId ?? '',
  amountPerMonth:
    payment.estimatedIncome != null ? String(payment.estimatedIncome) : '',
  dateFrom: payment.periodFrom ?? '',
  dateTo: payment.periodTo ?? '',
})

export const getPersistedRecords = <TPersisted>(
  externalData: ExternalData,
  persistedPath: string,
): TPersisted[] =>
  getValueViaPath<TPersisted[]>(externalData, persistedPath) ?? []

const buildDefaults =
  <TPersisted, TRow>(
    persistedPath: string,
    answersPath: string,
    toRow: (record: TPersisted) => TRow,
  ) =>
  (application: Application): TRow[] => {
    // Seed only until the section has been answered once. The repeater reseeds
    // whenever its array is empty, which would otherwise resurrect the rows the
    // user deleted every time they navigate back through the section.
    if (getValueViaPath(application.answers, answersPath) !== undefined) {
      return []
    }

    return getPersistedRecords<TPersisted>(
      application.externalData,
      persistedPath,
    ).map(toRow)
  }

export const getCasualWorkDefaults = buildDefaults(
  'income.data.irregularJobs',
  INCOME_TYPE_ANSWER_KEYS.casualWork,
  toCasualWorkRow,
)

export const getPartTimeDefaults = buildDefaults(
  'income.data.partTimeJobs',
  INCOME_TYPE_ANSWER_KEYS.partTime,
  toPartTimeRow,
)

export const getContractWorkDefaults = buildDefaults(
  'income.data.contractorJobs',
  INCOME_TYPE_ANSWER_KEYS.contractWork,
  toContractWorkRow,
)

export const getPensionDefaults = buildDefaults(
  'income.data.pensionPayments',
  INCOME_TYPE_ANSWER_KEYS.pension,
  toPensionRow,
)

export const getCapitalIncomeDefaults = buildDefaults(
  'income.data.capitalIncomePayments',
  INCOME_TYPE_ANSWER_KEYS.capitalIncome,
  toCapitalIncomeRow,
)

export const getSocialInsuranceDefaults = buildDefaults(
  'income.data.trPayments',
  INCOME_TYPE_ANSWER_KEYS.socialInsurance,
  toSocialInsuranceRow,
)
