export const taxInfoNumbers = {
  '2021': {
    taxPercentage: 31.45,
    personalTaxAllowance: 50792,
  },
}

interface TaxInfoYear {
  [id: string]: TaxInfo
}

export interface TaxInfo {
  personalTaxAllowance: number
  taxPercentage: number
}

export const calculateAidFinalAmount = (
  amount: number,
  usePersonalTaxAllowance: boolean,
  currentYear: string,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  const personalTaxAllowance = taxInfo.personalTaxAllowance

  const tax = Math.floor(amount * taxPercentage)

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const finalTaxAmount = Math.max(tax - personalTaxAllowanceUsed, 0)

  return amount - finalTaxAmount
}

export const calculateTaxOfAmount = (
  amount: number,
  currentYear: string,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  return Math.floor(amount * taxPercentage)
}

export const calculatePersonalTaxAllowanceUsed = (
  amount: number,
  usePersonalTaxAllowance: boolean,
  currentYear: string,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const personalTaxAllowance = taxInfo.personalTaxAllowance

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const tax = calculateTaxOfAmount(amount, currentYear)

  // Only show the amount of used personal tax allowence, not the full tax allowence
  return Math.min(personalTaxAllowanceUsed, tax)
}

export const calculateAcceptedAidFinalAmount = (
  amount: number,
  currentYear: string,
  personalTaxCreditPercentage: number,
  spousedPersonalTaxCreditPercentage: number,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  const personalTaxAllowance = Math.floor(
    taxInfo.personalTaxAllowance * (personalTaxCreditPercentage / 100),
  )

  const spouseTaxAllowance = Math.floor(
    taxInfo.personalTaxAllowance * (spousedPersonalTaxCreditPercentage / 100),
  )

  const tax = Math.floor(amount * taxPercentage)

  const finalTaxAmount = Math.max(
    tax - personalTaxAllowance + spouseTaxAllowance,
    0,
  )

  return amount - finalTaxAmount
}
