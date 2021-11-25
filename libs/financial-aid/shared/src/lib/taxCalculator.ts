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

export const calculateAidFinalAmountTEst = (
  amount: number,
  usePersonalTaxAllowance: boolean,
  currentYear: string,
  personalTaxCreditPercentage: number,
  spousedPersonalTaxCreditPercentage: number,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  const personalTaxAllowance =
    personalTaxCreditPercentage !== 0
      ? Math.floor(
          taxInfo.personalTaxAllowance * (personalTaxCreditPercentage / 100),
        )
      : taxInfo.personalTaxAllowance

  console.log(personalTaxAllowance)

  const tax = Math.floor(amount * taxPercentage)

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const finalTaxAmount = Math.max(tax - personalTaxAllowanceUsed, 0)

  return amount - finalTaxAmount
}

export const calculatePersonalTaxCreditPercentage = (
  personalTaxCreditPercentage: number,
  spousedPersonalTaxCreditPercentage: number,
  currentYear: string,
) => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  if (spousedPersonalTaxCreditPercentage !== 0) {
    const personalTaxAllowance =
      taxInfo.personalTaxAllowance * (personalTaxCreditPercentage / 100)

    const spouseTaxAllowance =
      taxInfo.personalTaxAllowance * (personalTaxCreditPercentage / 100)

    return personalTaxAllowance + spouseTaxAllowance
  }
}
