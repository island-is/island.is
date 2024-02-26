import { PermitHunting } from '../../gen/fetch'

export type HuntingLicenseDto = {
  holderNationalId: string
  holderName: string
  category: string
  number: string
  isValid: boolean
  validFrom?: Date
  validTo?: Date
  permitFor?: Array<string>
  benefits?: HuntingLicenseBenefitDto
  holderPhoto?: string
}

export type HuntingLicenseBenefitDto = {
  land?: string
  number?: string
}

//If the user's license is expired or invalid, no dates are sent.

export const mapHuntingLicenseDto = (
  data?: PermitHunting,
): HuntingLicenseDto | null => {
  if (
    !data ||
    !data.personid ||
    !data.personname ||
    !data.permitNumber ||
    !data.permitValidity
  ) {
    return null
  }

  return {
    holderNationalId: data.personid,
    holderName: data.personname,
    category: data.permitCategory ?? '',
    number: data.permitNumber,
    isValid: data.permitValidity == 'Í gildi',
    permitFor: data.permitFor,
    benefits: {
      land: data.benefits?.benefitLand,
      number: data.benefits?.benefitsNumber,
    },
    validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
    validTo: data.validTo ? new Date(data.validTo) : undefined,
    holderPhoto: data.personphoto,
  }
}
