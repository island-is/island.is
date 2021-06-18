// import { AidDateAmountListItem } from './veitaFinancialAidDefinitions'

export interface AidDateAmount {
  personalTaxAllowance: string
  taxPercentage: string
}

export const calculateAidFinalAmount = (
  amount: number,
  usePersonalTaxAllowance: boolean,
  dateAmount: AidDateAmount,
): number => {
  const taxPercentage = Number(dateAmount.taxPercentage) / 100

  const personalTaxAllowance = Number(dateAmount.personalTaxAllowance)

  const tax = Math.floor(amount * taxPercentage)

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const finalTaxAmount = Math.max(tax - personalTaxAllowanceUsed, 0)

  return amount - finalTaxAmount
}

export const calulateTaxOfAmount = (
  amount: number,
  dateAmount: AidDateAmount,
): number => {
  const taxPercentage = Number(dateAmount.taxPercentage) / 100

  return Math.floor(amount * taxPercentage)
}

export const calulatePersonalTaxAllowanceUsed = (
  amount: number,
  usePersonalTaxAllowance: boolean,
  dateAmount: AidDateAmount,
): number => {
  const personalTaxAllowance = Number(dateAmount.personalTaxAllowance)

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const tax = calulateTaxOfAmount(amount, dateAmount)

  // Only show the amount of used personal tax allowence, not the full tax allowence
  return Math.min(personalTaxAllowanceUsed, tax)
}
