import { DistrictCommissionersLicenseStatus } from '../districtCommissionersLicenses.types'

export interface DistrictCommissionersLicenseDto {
  id: string
  title?: string
  validFrom?: Date
  issuer?: string
  status?: DistrictCommissionersLicenseStatus
}
