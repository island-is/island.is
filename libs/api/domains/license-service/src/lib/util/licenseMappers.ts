import { GenericDrivingLicenseResponse } from '../client'
import { GenericLicense } from '../licenceService.type'

export const drivingLicenseToGeneric = (
  license: GenericDrivingLicenseResponse[],
) => {
  const out: GenericLicense = {
    name: license[0].nafn,
    type: 'driving-license',
    issuer: 'rls',
  }

  return out
}
