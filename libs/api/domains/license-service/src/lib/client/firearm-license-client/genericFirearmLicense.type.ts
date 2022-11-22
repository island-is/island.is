import {
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'

export interface LicenseData {
  licenseInfo?: LicenseInfo | null
  properties?: FirearmPropertyList | null
  categories?: { [key: string]: string }
}
