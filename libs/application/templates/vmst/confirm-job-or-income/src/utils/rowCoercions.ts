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

// Galdur wants null for monthly (open-ended) payments and a real dateTo for
// one-time ones; matches the submit-side `getPeriodTo` in confirm-job-or-income.utils.
export const periodToByFrequency = (row: IncomeValidationRow): string | null =>
  row.paymentFrequency === PaymentFrequency.ONE_TIME
    ? toRequiredString(row.dateTo)
    : null
