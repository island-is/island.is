import { DistrictCommissionersLicenseStatus } from '@island.is/clients/district-commissioners-licenses'
import { StatusV2 } from './models/licenseStatus.model'

export type LicenseType = 'Education' | 'Health' | 'DistrictCommissioners'

export const addLicenseTypePrefix = (id: string, type: LicenseType) => {
  switch (type) {
    case 'DistrictCommissioners':
      return 'D' + id
    case 'Education':
      return 'E' + id
    case 'Health':
      return 'H' + id
    default:
      throw new Error('Invalid license type')
  }
}

export const getLicenseTypeByIdPrefix = (
  id: string,
): { type: LicenseType; licenseId: string } | null => {
  let type: LicenseType | undefined

  if (id.startsWith('D')) {
    type = 'DistrictCommissioners'
  }
  if (id.startsWith('E')) {
    type = 'Education'
  }
  if (id.startsWith('H')) {
    type = 'Health'
  }

  if (!type) {
    return null
  }

  return { type, licenseId: id.substring(1) }
}

export const mapDistrictCommissionersLicenseStatusToStatus = (
  status: DistrictCommissionersLicenseStatus,
): StatusV2 => {
  switch (status) {
    case 'expired':
      return StatusV2.INVALID

    case 'in-progress':
      return StatusV2.IN_PROGRESS

    case 'valid':
      return StatusV2.VALID

    default:
      return StatusV2.UNKNOWN
  }
}
