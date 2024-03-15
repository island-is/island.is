import * as mapper from './machineLicenseMapper'
import ExpiredMachineLicense from '../__mock_data/expiredMachineLicense.json'
import ValidMachineLicense from '../__mock_data/validMachineLicense.json'

describe('license-service/client/machine-license', () => {
  describe('check if expired', () => {
    it('should return null if no license info', async () => {
      const result = mapper.checkLicenseExpirationDate({})
      expect(result).toBeNull()
    })
    it('should return true if expired', async () => {
      const result = mapper.checkLicenseExpirationDate(ExpiredMachineLicense)
      expect(result).toBeTruthy()
    })
    it('should return false if valid and not expired', async () => {
      const result = mapper.checkLicenseExpirationDate(ValidMachineLicense)
      expect(result).toBeFalsy()
    })
  })
  describe('get latest license qualification expiration date', () => {
    it('should return the latest license right date', async () => {
      const result = mapper.findLatestExpirationDate(ValidMachineLicense)

      const expectedDate = new Date('2080-01-01T00:00:00Z').toISOString()

      expect(result).toMatch(expectedDate)
    })
    it('should return undefined if no license info', async () => {
      const result = mapper.findLatestExpirationDate({})

      expect(result).toBeNull
    })
  })
})
