import { LicenseApiScope } from '@island.is/auth/scopes'
import { LicenseId } from './license.types'

export const licenseTypeToScope: Record<LicenseId, LicenseApiScope> = {
  firearm: LicenseApiScope.licensesFirearm,
  disability: LicenseApiScope.licensesDisability,
  driving: LicenseApiScope.licensesDriving,
}
