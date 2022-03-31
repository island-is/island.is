import '@testing-library/jest-dom'

import { formatBankInfo, formatPhoneNumber } from './formatters'

describe('formatters', () => {
  describe('formatBankInfo', () => {
    it('should return the same value if bank info is in correct format', async () => {
      // arrange
      const bankInfo = '0000-11-222222'
      const expectedBankInfo = '0000-11-222222'
      // assert
      expect(formatBankInfo(bankInfo)).toBe(expectedBankInfo)
    })

    it('should format bank info if it comes as 14 characters length string', async () => {
      // arrange
      const bankInfo = '000011222222'
      const expectedBankInfo = '0000-11-222222'
      // assert
      expect(formatBankInfo(bankInfo)).toBe(expectedBankInfo)
    })

    it('should return empty string if bank info is too long', async () => {
      // arrange
      const bankInfo = '0000112222222'
      const expectedBankInfo = '0000112222222'
      // assert
      expect(formatBankInfo(bankInfo)).toBe(expectedBankInfo)
    })

    it('should return empty string if bank info comes in weird format', async () => {
      // arrange
      const bankInfo = '000#test011222$$222'
      const expectedBankInfo = '000#test011222$$222'
      // assert
      expect(formatBankInfo(bankInfo)).toBe(expectedBankInfo)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should place "-" after 3 digits', async () => {
      // arrange
      const phoneNumber = '9999999'
      const expectedPhoneNumber = '999-9999'
      // assert
      expect(formatPhoneNumber(phoneNumber)).toBe(expectedPhoneNumber)
    })
  })
})
