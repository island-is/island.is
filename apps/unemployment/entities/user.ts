export interface User {
  nationalId: string
  name: string
  address: string
  postalCode: string
  gsm: string
  email: string
  numberOfChildren: number
  city: string
  phone?: string
}

// TODO: Endurskoða extend-ið, líklega óþarfa upplýsingar
export interface TaxPayerInformation extends Pick<User, 'nationalId' | 'name'> {
  lastPersonalTaxCreditPercentageUsed: number
  workingSituation: string
  monthlyIncome: number
  ageOrDisabilityBenefitsFromSocialInsuranceAdministration: number
  ageOrDisabilityBenefitsFromPensionFunds: number
  personalPensionFundPaymentPercentage: number
  unionPaymentPercentage: number
  percentageOfWork: number
  pensionFundPaymentPercentage: number
  isOnMaternityOrPaternityLeave: boolean
  numberOfChildrenInCare: number
}
