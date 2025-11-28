import { PermitHunting } from '@island.is/clients/nvs-permits'
import { HuntingLicenseDto, Validity } from './types'

//If the user's license is expired or invalid, no dates are sent.

export const mapHuntingLicenseDto = (
  data?: PermitHunting,
): HuntingLicenseDto | null => {
  if (
    !data ||
    !data.personid ||
    !data.personname ||
    !data.permit_number ||
    !data.permit_validity ||
    !data.address
  ) {
    return null
  }

  let holderCity
  if (data.postal_code) {
    holderCity = data.postal_code
  }
  if (data.postal_address) {
    if (holderCity) {
      holderCity += ` ${data.postal_address}`
    } else {
      holderCity = data.postal_address
    }
  }

  let validity: Validity
  switch (data.permit_validity) {
    case 'Í gildi':
    case 'Valid':
      validity = 'active'
      break
    case 'Ekki í gildi':
    case 'Expired':
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
    category: data.permit_category ?? '',
    number: data.permit_number,
    validity,
    isValid: data.permit_validity === 'Í gildi',
    permitFor: data.permit_for,
    benefits: data.benefits?.map((b) => ({
      land: b.benefit_land,
      number: b.benefits_number,
    })),
    validFrom: data.valid_from ? new Date(data.valid_from) : undefined,
    validTo: data.valid_to ? new Date(data.valid_to) : undefined,
    holderPhoto: data.personphoto,
    renewalUrl: data.permit_renew_link,
  }
}
