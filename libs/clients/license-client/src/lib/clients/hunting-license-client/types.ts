export type Validity = 'active' | 'expired' | 'unknown'

export type HuntingLicenseDto = {
  holderNationalId: string
  holderName: string
  holderAddress: string
  holderCity: string
  category: string
  number: string
  isValid: boolean
  validity: Validity
  validFrom?: Date
  validTo?: Date
  permitFor?: Array<string>
  benefits?: Array<HuntingLicenseBenefitDto>
  renewalUrl?: string
  holderPhoto?: string
}

export type HuntingLicenseBenefitDto = {
  land?: string
  number?: string
}
