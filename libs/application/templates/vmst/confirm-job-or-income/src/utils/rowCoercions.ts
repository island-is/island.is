import { PaymentFrequency } from './constants'
import { IncomeValidationRow } from './validateIncomes'

export const toRequiredString = (value: unknown): string => String(value ?? '')

export const toOptionalString = (value: unknown): string | undefined => {
  const s = String(value ?? '')
  return s || undefined
}

export const toOptionalNumber = (value: unknown): number | undefined =>
  value ? Number(value) : undefined

export const toRequiredNumber = (value: unknown): number => Number(value ?? 0)

// Extracts a company nationalId from a row and strips the hyphen Galdur rejects.
export const getCompanyNationalId = (
  row: IncomeValidationRow,
): string | undefined => {
  const company = row.company
  if (typeof company !== 'object' || company === null) return undefined
  const nationalId = (company as { nationalId?: string }).nationalId
  return nationalId ? nationalId.replace(/-/g, '') : undefined
}

export const isOneTimePayment = (row: IncomeValidationRow): boolean =>
  row.paymentFrequency === PaymentFrequency.ONE_TIME

// One-time payments are flagged with oneTimePayment and have no end date.
// Monthly payments send the chosen dateTo, or null for an open-ended period.
// Matches the submit-side `getPeriodTo` in confirm-job-or-income.utils.
export const periodToByFrequency = (row: IncomeValidationRow): string | null =>
  isOneTimePayment(row) ? null : toOptionalString(row.dateTo) ?? null
