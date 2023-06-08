import { AdrDto } from '@island.is/clients/adr-and-machine-license'
import { GenericUserLicensePkPassStatus } from '../../licenceService.type'
import { GenericAdrLicenseService } from './genericAdrLicense.service'

describe('license-service/client/adr-license', () => {
  describe('pkpass status', () => {
    it('should be unknown for empty license', async () => {
      const licenseInfo: AdrDto = {}
      const result =
        GenericAdrLicenseService.licenseIsValidForPkpass(licenseInfo)
      expect(result).toBe(GenericUserLicensePkPassStatus.Unknown)
    })

    it('should be available for a license with a future expiration date', async () => {
      const licenseInfo: AdrDto = {
        gildirTil: '2028-06-01',
      }
      const result =
        GenericAdrLicenseService.licenseIsValidForPkpass(licenseInfo)
      expect(result).toBe(GenericUserLicensePkPassStatus.Available)
    })

    it('shouldnt be available for a license with a passed expiration date', async () => {
      const licenseInfo: AdrDto = {
        gildirTil: '2020-06-01',
      }
      const result =
        GenericAdrLicenseService.licenseIsValidForPkpass(licenseInfo)
      expect(result).toBe(GenericUserLicensePkPassStatus.NotAvailable)
    })

    it('shouldnt be available for a license with a invalid expiration date', async () => {
      const licenseInfo: AdrDto = {
        gildirTil: 'abcc',
      }
      const result =
        GenericAdrLicenseService.licenseIsValidForPkpass(licenseInfo)
      expect(result).toBe(GenericUserLicensePkPassStatus.NotAvailable)
    })
  })
})
