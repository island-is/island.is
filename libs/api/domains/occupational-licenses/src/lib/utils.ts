import { DistrictCommissionersLicenseStatus } from '@island.is/clients/district-commissioners-licenses'
import { Status } from './models/licenseStatus.model'
import { LicenseType } from './models/licenseType.model'

export const addLicenseTypePrefix = (id: string, type: LicenseType) => {
  switch (type) {
    case LicenseType.DISTRICT_COMMISSIONERS:
      return 'D' + id
    case LicenseType.EDUCATION:
      return 'E' + id
    case LicenseType.HEALTH_DIRECTORATE:
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
    type = LicenseType.DISTRICT_COMMISSIONERS
  }
  if (id.startsWith('E')) {
    type = LicenseType.EDUCATION
  }
  if (id.startsWith('H')) {
    type = LicenseType.HEALTH_DIRECTORATE
  }

  if (!type) {
    return null
  }

  return { type, licenseId: id.substring(1) }
}

export const mapDistrictCommissionersLicenseStatusToStatus = (
  status: DistrictCommissionersLicenseStatus,
): Status => {
  switch (status) {
    case 'expired':
      return Status.INVALID

    case 'in-progress':
      return Status.IN_PROGRESS

    case 'valid':
      return Status.VALID

    default:
      return Status.UNKNOWN
  }
}
