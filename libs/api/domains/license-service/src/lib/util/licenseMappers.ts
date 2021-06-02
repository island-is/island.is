import { GenericLicense } from '../licenceService.type'
import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'

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
