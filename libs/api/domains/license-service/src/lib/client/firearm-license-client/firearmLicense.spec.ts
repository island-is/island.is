import { LicenseInfo } from '@island.is/clients/firearm-license'
import { GenericUserLicensePkPassStatus } from '../../licenceService.type'
import { GenericFirearmLicenseApi } from './firearmLicenseService.api'

describe('license-service/client/firearm-license', () => {
  describe('pkpass status', () => {
    it('should be unknown for empty license', async () => {
      const licenseInfo: LicenseInfo = {}
      const result = GenericFirearmLicenseApi.licenseIsValidForPkpass(
        licenseInfo,
      )
      expect(result).toBe(GenericUserLicensePkPassStatus.Unknown)
    })

    it('should be available for a license with a future expiration date', async () => {
      const licenseInfo: LicenseInfo = {
        expirationDate: '2028-06-01',
      }
      const result = GenericFirearmLicenseApi.licenseIsValidForPkpass(
        licenseInfo,
      )
      expect(result).toBe(GenericUserLicensePkPassStatus.Available)
    })

    it('shouldnt be available for a license with a passed expiration date', async () => {
      const licenseInfo: LicenseInfo = {
        expirationDate: '2020-06-01',
      }
      const result = GenericFirearmLicenseApi.licenseIsValidForPkpass(
        licenseInfo,
      )
      expect(result).toBe(GenericUserLicensePkPassStatus.NotAvailable)
    })
  })
})
