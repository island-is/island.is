import { Adgerd } from '../../../gen/fetch'

export interface DistrictCommissionersLicenseActionDto {
  type: 'link' | 'file' | 'document'
  title: string
  url: string
}

export const mapLicenseActionDto = (
  action: Adgerd,
): DistrictCommissionersLicenseActionDto | null => {
  if (!action.slod || !action.tegund || !action.titill) {
    return null
  }

  let type: 'link' | 'file' | 'document' | 'unknown'
  switch (action.tegund) {
    case 'file':
      type = 'file'
      break
    case 'link':
      type = 'link'
      break
    case 'postholf':
      type = 'document'
      break
    default:
      type = 'unknown'
  }

  if (type === 'unknown') {
    return null
  }

  return {
    type,
    title: action.titill,
    url: action.slod,
  }
}
