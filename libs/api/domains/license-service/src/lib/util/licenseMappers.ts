import { GenericDrivingLicenseResponse } from '../client'
import {
  GenericUserLicenseFields,
  LICENSE_TYPE,
  LICENSE_TITLES,
  LICENSE_PROVIDERS,
} from '../licenceService.type'

export const drivingLicenseToGeneric = (
  license: GenericDrivingLicenseResponse[],
) => {
  const licenseid: LICENSE_TYPE = 'DRIVERS_LICENSE'
  const out: GenericUserLicenseFields = {
    licenseType: licenseid,
    nationalId: '',
    expidationDate: new Date(),
    issueDate: new Date(),
    licenseStatus: 'HAS_LICENSE',
    fetchStatus: 'FETCHED',
    pkpassUrl: '',
    payload: '',
  }

  return out
}
