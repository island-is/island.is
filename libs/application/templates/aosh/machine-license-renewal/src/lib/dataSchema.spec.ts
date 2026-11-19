import { NO, YES } from '@island.is/application/core'
import { DeliveryMethod } from '../utils/constants'
import { dataSchema } from './dataSchema'

const applicantSchema = dataSchema.shape.applicant
const medicalCertificateSchema = dataSchema.shape.medicalCertificate
const licenseSchema = dataSchema.shape.license

const applicant = {
  name: 'Jón Jónsson',
  nationalId: '0101302399',
  address: 'Brekkugata 12',
  postalCode: '111',
  city: 'Reykjavík',
  email: 'jon@example.com',
  phoneNumber: '+3545556677',
}

describe('dataSchema', () => {
  describe('applicant', () => {
    it('accepts a valid email and phone number', () => {
      expect(applicantSchema.safeParse(applicant).success).toBe(true)
    })

    it.each(['', 'jon@'])('rejects the email "%s"', (email) => {
      const result = applicantSchema.safeParse({ ...applicant, email })

      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].path).toEqual(['email'])
    })

    it.each(['', '123'])('rejects the phone number "%s"', (phoneNumber) => {
      const result = applicantSchema.safeParse({ ...applicant, phoneNumber })

      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].path).toEqual([
        'phoneNumber',
      ])
    })
  })

  describe('medicalCertificate', () => {
    it('rejects an empty list of files', () => {
      expect(medicalCertificateSchema.safeParse([]).success).toBe(false)
    })

    it('rejects more than one file', () => {
      expect(
        medicalCertificateSchema.safeParse([
          { name: 'vottord.pdf', key: 'vottord-key' },
          { name: 'vottord2.pdf', key: 'vottord2-key' },
        ]).success,
      ).toBe(false)
    })

    it('accepts a single file', () => {
      expect(
        medicalCertificateSchema.safeParse([
          { name: 'vottord.pdf', key: 'vottord-key' },
        ]).success,
      ).toBe(true)
    })
  })

  describe('license', () => {
    it('accepts no plastic card without delivery details', () => {
      expect(licenseSchema.safeParse({ plasticCard: NO }).success).toBe(true)
    })

    it('accepts no plastic card after delivery details were cleared', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: NO,
          deliveryMethod: '',
          address: '',
          postalCode: '',
          recipient: '',
        }).success,
      ).toBe(true)
    })

    it('requires a delivery method when a plastic card is requested', () => {
      const result = licenseSchema.safeParse({ plasticCard: YES })

      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].path).toEqual([
        'deliveryMethod',
      ])
    })

    it('requires a delivery method when it was cleared and a plastic card is requested', () => {
      const result = licenseSchema.safeParse({
        plasticCard: YES,
        deliveryMethod: '',
      })

      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].path).toEqual([
        'deliveryMethod',
      ])
    })

    it('accepts delivery to legal domicile without an address', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: YES,
          deliveryMethod: DeliveryMethod.LEGAL_DOMICILE,
        }).success,
      ).toBe(true)
    })

    it('accepts delivery to legal domicile after another address was cleared', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: YES,
          deliveryMethod: DeliveryMethod.LEGAL_DOMICILE,
          address: '',
          postalCode: '',
          recipient: '',
        }).success,
      ).toBe(true)
    })

    it('accepts delivery to legal domicile after the postal code select was reset', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: YES,
          deliveryMethod: DeliveryMethod.LEGAL_DOMICILE,
          address: '',
          postalCode: null,
          recipient: '',
        }).success,
      ).toBe(true)
    })

    it('requires address and postal code when delivering to another address', () => {
      const result = licenseSchema.safeParse({
        plasticCard: YES,
        deliveryMethod: DeliveryMethod.OTHER_ADDRESS,
        address: ' ',
      })

      expect(result.success).toBe(false)
      expect(
        !result.success && result.error.issues.map((issue) => issue.path),
      ).toEqual([['address'], ['postalCode']])
    })

    it('rejects a postal code that is not in the postal code list', () => {
      const result = licenseSchema.safeParse({
        plasticCard: YES,
        deliveryMethod: DeliveryMethod.OTHER_ADDRESS,
        address: 'Nönnugata 1',
        postalCode: '101.5',
      })

      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].path).toEqual([
        'postalCode',
      ])
    })

    it('accepts another address without a recipient', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: YES,
          deliveryMethod: DeliveryMethod.OTHER_ADDRESS,
          address: 'Nönnugata 1',
          postalCode: '101',
        }).success,
      ).toBe(true)
    })
  })
})
