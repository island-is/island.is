import { NO, YES } from '@island.is/application/core'
import { DeliveryMethod } from '../utils/constants'
import { dataSchema } from './dataSchema'

const medicalCertificateSchema = dataSchema.shape.medicalCertificate
const licenseSchema = dataSchema.shape.license

describe('dataSchema', () => {
  describe('medicalCertificate', () => {
    it('rejects an empty list of files', () => {
      expect(medicalCertificateSchema.safeParse([]).success).toBe(false)
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
          postalCodeAndCity: '',
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
          postalCodeAndCity: '',
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
      ).toEqual([['address'], ['postalCodeAndCity']])
    })

    it('accepts another address without a recipient', () => {
      expect(
        licenseSchema.safeParse({
          plasticCard: YES,
          deliveryMethod: DeliveryMethod.OTHER_ADDRESS,
          address: 'Nönnugata 1',
          postalCodeAndCity: '101 Reykjavík',
        }).success,
      ).toBe(true)
    })
  })
})
