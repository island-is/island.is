import { GenericDrivingLicenseResponse } from '../client'
import { GenericUserLicenseFields, LICENSE_TYPE } from '../licenceService.type'

export const drivingLicensesToSingleGenericLicense = (
  licenses: GenericDrivingLicenseResponse[],
): GenericUserLicenseFields | null => {
  if (licenses.length === 0) {
    return null
  }

  // TODO we're only handling the first driving license, we get them ordered so pick first
  const license = licenses[0]

  const licenseid: LICENSE_TYPE = 'DRIVERS_LICENSE'
  const out: GenericUserLicenseFields = {
    licenseType: licenseid,
    nationalId: license.kennitala,
    expidationDate: new Date(),
    issueDate: new Date(),
    licenseStatus: 'HAS_LICENSE',
    fetchStatus: 'FETCHED',
    pkpassUrl: '',
    payload: {
      data: [],
      rawData: JSON.stringify(license),
    },
  }

  return out
}
