import { Svid } from '../../../gen/fetch'

export interface DistrictCommissionersLicenseFieldDto {
  title: string
  value: string
}

export const mapLicenseFieldDto = (
  action: Svid,
): DistrictCommissionersLicenseFieldDto | null => {
  if (!action.gildi || !action.heiti || !action.tegund) {
    return null
  }

  return {
    title: action.heiti,
    value: action.gildi,
  }
}
