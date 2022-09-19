import { FirearmPropertyList, LicenseInfo } from '../../gen/fetch'

export interface LicenseData {
  licenseInfo?: LicenseInfo | null
  properties?: FirearmPropertyList | null
  categories?: { [key: string]: string }
}
