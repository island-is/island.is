import { PermitHunting, PermitHuntingPermitValidityEnum } from '../../gen/fetch'

export type HuntingLicenseDto = {
  holderNationalId: string
  holderName: string
  holderAddress: string
  holderCity: string
  category: string
  number: string
  isValid: boolean
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

//If the user's license is expired or invalid, no dates are sent.

export const mapHuntingLicenseDto = (
  data?: PermitHunting,
): HuntingLicenseDto | null => {
  if (
    !data ||
    !data.personid ||
    !data.personname ||
    !data.permitNumber ||
    !data.permitValidity ||
    !data.address
  ) {
    return null
  }

  let holderCity
  if (data.postalCode) {
    holderCity = data.postalCode
  }
  if (data.postalAddress) {
    if (holderCity) {
      holderCity += ` ${data.postalAddress}`
    } else {
      holderCity = data.postalAddress
    }
  }

  return {
    holderNationalId: data.personid,
    holderName: data.personname,
    holderAddress: data.address,
    holderCity: holderCity ?? '',
    category: data.permitCategory ?? '',
    number: data.permitNumber,
    isValid: data.permitValidity === PermitHuntingPermitValidityEnum.Gildi,
    permitFor: data.permitFor,
    benefits: data.benefits?.map((b) => ({
      land: b.benefitLand,
      number: b.benefitsNumber,
    })),
    validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
    validTo: data.validTo ? new Date(data.validTo) : undefined,
    holderPhoto: data.personphoto,
    renewalUrl: data.permitRenewLink,
  }
}
