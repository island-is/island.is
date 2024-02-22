import { DistrictCommissionersLicenseStatus } from './districtCommissionersLicenses.types'

export const mapStatusToLiteral = (
  status: string,
): DistrictCommissionersLicenseStatus => {
  if (status === 'VALID') return 'valid'
  if (status === 'EXPIRED') return 'expired'
  if (status === 'INPROGRESS') return 'in-progress'

  return 'unknown'
}
