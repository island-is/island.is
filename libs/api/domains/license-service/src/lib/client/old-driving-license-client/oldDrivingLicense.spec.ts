import { OldGenericDrivingLicenseResponse } from './oldGenericDrivingLicense.type'
import { OldGenericDrivingLicenseApi } from './oldGenericDrivingLicense.service'
import { GenericUserLicensePkPassStatus } from '../../licenceService.type'
describe('license-service/client/driving-license', () => {
  // Since the client needs to be refactored out of the service, test the
  // logic independantly via the static method
  // See readme for rules
  describe('pkpass status', () => {
    it('should be unknown for empty license', async () => {
      const license: OldGenericDrivingLicenseResponse = {}

      const result =
        OldGenericDrivingLicenseApi.licenseIsValidForPkpass(license)

      expect(result).toBe(GenericUserLicensePkPassStatus.Unknown)
    })

    it('should be valid for a license with a `mynd`', () => {
      const license: OldGenericDrivingLicenseResponse = {
        mynd: {
          mynd: 'not-empty',
          skrad: '1997-08-14T00:00:00',
        },
      }

      const result =
        OldGenericDrivingLicenseApi.licenseIsValidForPkpass(license)

      expect(result).toBe(GenericUserLicensePkPassStatus.Available)
    })
  })
})
