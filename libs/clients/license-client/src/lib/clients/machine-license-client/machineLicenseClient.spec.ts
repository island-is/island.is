import * as mapper from './machineLicenseMapper'
import ValidMachineLicense from '../__mock_data/validMachineLicense.json'

describe('license-service/client/machine-license', () => {
  describe('license expiration date handling', () => {
    describe('get latest license qualification expiration date', () => {
      it('should return the latest license right date', async () => {
        const result = mapper.findLatestExpirationDate(ValidMachineLicense)

        const expectedDate = new Date('2080-01-01T00:00:00Z').toISOString()

        expect(result).toMatch(expectedDate)
      })
      it('should return undefined if no license info', async () => {
        const result = mapper.findLatestExpirationDate({})

        expect(result).toBeNull()
      })

      it('should handle multiple dates and return the latest', () => {
        const licenseWithMultipleDates = {
          ...ValidMachineLicense,
          qualifications: [
            { expiryDate: '2023-01-01T00:00:00Z' },
            { expiryDate: '2023-12-31T00:00:00Z' },
            { expiryDate: '2023-06-01T00:00:00Z' },
          ],
        }
        const result = mapper.findLatestExpirationDate(licenseWithMultipleDates)
        expect(result).toBe('2023-12-31T00:00:00Z')
      })

      it('should handle invalid date formats gracefully', () => {
        const licenseWithInvalidDate = {
          ...ValidMachineLicense,
          qualifications: [{ expiryDate: 'invalid-date' }],
        }
        const result = mapper.findLatestExpirationDate(licenseWithInvalidDate)
        expect(result).toBeNull()
      })
    })
  })
})
