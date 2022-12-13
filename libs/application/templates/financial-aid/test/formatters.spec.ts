import { formatAddress, formatBankInfo } from '../src/lib/formatters'

describe('Formatters test', () => {
  describe('Address format', () => {
    test('should return that undefined', () => {
      const notValidApplicant = formatAddress(undefined)
      expect(notValidApplicant).toEqual(undefined)
    })
  })

  describe('Address format', () => {
    test('should return that valid address', () => {
      const applicant = {
        nationalId: '',
        fullName: '',
        genderCode: '',
        citizenship: null,
        age: 0,
        address: {
          streetAddress: 'Flatahraun 10',
          postalCode: '220',
          locality: 'Hafnafjordur',
          municipalityCode: '1400',
        },
      }

      const validApplicant = formatAddress(applicant)
      expect(validApplicant).toEqual(
        `${applicant.address.streetAddress}, ${applicant.address.postalCode} ${applicant.address.locality}`,
      )
    })
  })

  describe('Bank info format', () => {
    test('should return empty string', () => {
      const bankInfo = {
        bankNumber: undefined,
        ledger: undefined,
        accountNumber: undefined,
      }
      const notValidBankInfo = formatBankInfo(bankInfo)
      expect(notValidBankInfo).toEqual('')
    })
  })

  describe('Bank info format', () => {
    test('should return empty string', () => {
      const bankInfo = {
        bankNumber: '0000',
        ledger: undefined,
        accountNumber: undefined,
      }
      const notValidBankInfo = formatBankInfo(bankInfo)
      expect(notValidBankInfo).toEqual('')
    })
  })

  describe('Bank info format', () => {
    test('should return empty string', () => {
      const bankInfo = {
        bankNumber: '0000',
        ledger: '00',
        accountNumber: undefined,
      }
      const notValidBankInfo = formatBankInfo(bankInfo)
      expect(notValidBankInfo).toEqual('')
    })
  })

  describe('Bank info format', () => {
    test('should return empty string', () => {
      const bankInfo = {
        bankNumber: undefined,
        ledger: '00',
        accountNumber: '000000',
      }
      const notValidBankInfo = formatBankInfo(bankInfo)
      expect(notValidBankInfo).toEqual('')
    })
  })

  describe('Bank info format', () => {
    test('should return string', () => {
      const bankInfo = {
        bankNumber: '0000',
        ledger: '00',
        accountNumber: '000000',
      }
      const notValidBankInfo = formatBankInfo(bankInfo)
      expect(notValidBankInfo).toEqual(
        bankInfo?.bankNumber +
          '-' +
          bankInfo?.ledger +
          '-' +
          bankInfo?.accountNumber,
      )
    })
  })
})
