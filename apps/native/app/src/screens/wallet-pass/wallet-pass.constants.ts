import { GenericLicenseType } from '../../graphql/types/schema'

export const INFORMATION_BASE_TOP_SPACING = 32
export const BARCODE_MAX_WIDTH = 500

export const INCLUDED_LICENSE_TYPES = [
  GenericLicenseType.DriversLicense,
  GenericLicenseType.AdrLicense,
  GenericLicenseType.MachineLicense,
  GenericLicenseType.FirearmLicense,
  GenericLicenseType.DisabilityLicense,
  GenericLicenseType.PCard,
  GenericLicenseType.Ehic,
  GenericLicenseType.HuntingLicense,
  GenericLicenseType.Passport,
]

export const SHOW_INFO_ALERT_TYPES = [
  GenericLicenseType.DriversLicense,
  GenericLicenseType.PCard,
  GenericLicenseType.Ehic,
  GenericLicenseType.Passport,
  GenericLicenseType.IdentityDocument,
]
