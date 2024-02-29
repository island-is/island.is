import { DistrictCommissionersLicenseStatus } from '@island.is/clients/district-commissioners-licenses'
import { OccupationalLicenseStatusV2 } from './models/license.model'

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
): OccupationalLicenseStatusV2 => {
  switch (status) {
    case 'expired':
      return OccupationalLicenseStatusV2.INVALID

    case 'in-progress':
      return OccupationalLicenseStatusV2.IN_PROGRESS

    case 'valid':
      return OccupationalLicenseStatusV2.VALID

    default:
      return OccupationalLicenseStatusV2.UNKNOWN
  }
}
