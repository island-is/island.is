import { Leyfi } from '../../../gen/fetch'
import { DistrictCommissionersLicenseStatus } from '../districtCommissionersLicenses.types'
import { mapStatusToLiteral } from '../util'

export interface DistrictCommissionersLicenseInfoDto {
  id: string
  title: string
  validFrom: Date
  issuer: string
  status: DistrictCommissionersLicenseStatus
}

export const mapLicenseInfoDto = (
  license: Leyfi,
): DistrictCommissionersLicenseInfoDto | null => {
  if (
    !license.audkenni ||
    !license.titill ||
    !license.utgafudagur ||
    !license.utgefandi?.titill ||
    !license.stada?.kodi
  ) {
    return null
  }
  return {
    id: license.audkenni,
    title: license?.titill,
    validFrom: license?.utgafudagur,
    issuer: license?.utgefandi?.titill,
    status: mapStatusToLiteral(license?.stada?.kodi),
  }
}
