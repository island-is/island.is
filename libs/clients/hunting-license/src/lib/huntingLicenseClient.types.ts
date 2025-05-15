import { PermitHunting, PermitHuntingPermitValidityEnum } from '../../gen/fetch'

type Validity = 'active' | 'expired' | 'unknown'

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

  let validity: Validity
  switch (data.permitValidity) {
    case PermitHuntingPermitValidityEnum.Gildi:
    case PermitHuntingPermitValidityEnum.Valid:
      validity = 'active'
      break
    case PermitHuntingPermitValidityEnum.EkkiGildi:
    case PermitHuntingPermitValidityEnum.Expired:
      validity = 'expired'
      break
    default:
      validity = 'unknown'
      break
  }

  return {
    holderNationalId: data.personid,
    holderName: data.personname,
    holderAddress: data.address,
    holderCity: holderCity ?? '',
    category: data.permitCategory ?? '',
    number: data.permitNumber,
    validity,
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
