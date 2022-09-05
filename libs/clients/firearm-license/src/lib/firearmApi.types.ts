import { FirearmPropertyList, LicenseInfo } from '../../gen/fetch'

export interface LicenseAndPropertyInfo extends OmittedLicenseInfo {
  properties?: FirearmPropertyList | null
}

export type OmittedLicenseInfo = Omit<LicenseInfo, 'licenseImgBase64'>
