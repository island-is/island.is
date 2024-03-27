import { OrganizationSlugType } from '@island.is/shared/constants'
import { Leyfi } from '../../../gen/fetch'
import { DistrictCommissionersLicenseStatus } from '../districtCommissionersLicenses.types'
import { mapIssuerIdToOrganizationSlugType, mapStatusToLiteral } from '../util'

export interface DistrictCommissionersLicenseInfoDto {
  id: string
  title: string
  validFrom: Date
  issuerId: OrganizationSlugType
  issuerTitle: string
  status: DistrictCommissionersLicenseStatus
}

export const mapLicenseInfoDto = (
  license: Leyfi,
): DistrictCommissionersLicenseInfoDto | null => {
  if (
    !license.audkenni ||
    !license.titill ||
    !license.utgafudagur ||
    !license.utgefandi?.audkenni ||
    !license.utgefandi?.titill ||
    !license.stada?.kodi
  ) {
    return null
  }
  return {
    id: license.audkenni,
    title: license?.titill,
    validFrom: license?.utgafudagur,
    issuerId: mapIssuerIdToOrganizationSlugType(license.utgefandi.audkenni),
    issuerTitle: license?.utgefandi?.titill,
    status: mapStatusToLiteral(license?.stada?.kodi),
  }
}
