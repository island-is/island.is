import { FirearmPropertyList, LicenseInfo } from '../../gen/fetch'

export interface LicenseAndPropertyInfo extends LicenseInfo {
  properties?: FirearmPropertyList | null
}
