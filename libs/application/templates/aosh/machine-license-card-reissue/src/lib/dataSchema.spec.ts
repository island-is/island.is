import {
  CardDeliverySchema,
  MachineLicenseCardReissueAnswersSchema,
} from './dataSchema'
import { AddressDeliveryType } from '../shared'

const validApplicant = {
  name: 'Jón Jónsson',
  nationalId: '0101302989',
  address: 'Laugavegur 1',
  postalCode: '101',
  city: 'Reykjavík',
  email: 'jon@example.com',
  phoneNumber: '+3545555555',
}

const validCurrentDelivery = {
  type: AddressDeliveryType.CURRENT,
  currentAddress: {
    streetAddress: 'Laugavegur 1',
    postalCode: '101',
    city: 'Reykjavík',
  },
}

const validOtherDelivery = {
  type: AddressDeliveryType.OTHER,
  address: 'Skólavörðustígur 2',
  postalCodeAndCity: '101 Reykjavík',
  recipient: 'Anna Jónsdóttir',
}

const validAnswers = {
  approveExternalData: true,
  applicant: validApplicant,
  cardDelivery: validCurrentDelivery,
  overview: { agreementCheckbox: ['yes'] },
}

const errorPaths = (result: { success: boolean; error?: unknown }) =>
  result.success
    ? []
    : (
        result as {
          error: { issues: { path: (string | number)[] }[] }
        }
      ).error.issues.map((issue) => issue.path.join('.'))

describe('MachineLicenseCardReissueAnswersSchema', () => {
  it('accepts valid answers with delivery to current address', () => {
    expect(
      MachineLicenseCardReissueAnswersSchema.safeParse(validAnswers).success,
    ).toBe(true)
  })

  it('accepts valid answers with delivery to another address', () => {
    const result = MachineLicenseCardReissueAnswersSchema.safeParse({
      ...validAnswers,
      cardDelivery: validOtherDelivery,
    })
    expect(result.success).toBe(true)
  })

  describe('approveExternalData', () => {
    it('rejects when external data is not approved', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        approveExternalData: false,
      })
      expect(errorPaths(result)).toContain('approveExternalData')
    })

    it('rejects when approval is missing', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        approveExternalData: undefined,
      })
      expect(errorPaths(result)).toContain('approveExternalData')
    })
  })

  describe('applicant', () => {
    it('rejects an invalid email', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        applicant: { ...validApplicant, email: 'not-an-email' },
      })
      expect(errorPaths(result)).toContain('applicant.email')
    })

    it('rejects a missing phone number since phone is required', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        applicant: { ...validApplicant, phoneNumber: '' },
      })
      expect(errorPaths(result)).toContain('applicant.phoneNumber')
    })

    it('rejects an invalid phone number', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        applicant: { ...validApplicant, phoneNumber: '123' },
      })
      expect(errorPaths(result)).toContain('applicant.phoneNumber')
    })
  })

  describe('overview', () => {
    it('rejects when the agreement checkbox is not checked', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        overview: { agreementCheckbox: [] },
      })
      expect(errorPaths(result)).toContain('overview.agreementCheckbox')
    })

    it('rejects an empty string value in the agreement checkbox', () => {
      const result = MachineLicenseCardReissueAnswersSchema.safeParse({
        ...validAnswers,
        overview: { agreementCheckbox: [''] },
      })
      expect(errorPaths(result)).toContain('overview.agreementCheckbox.0')
    })
  })
})

describe('CardDeliverySchema', () => {
  it('accepts current address without any other address fields', () => {
    expect(
      CardDeliverySchema.safeParse({ type: AddressDeliveryType.CURRENT })
        .success,
    ).toBe(true)
  })

  it('accepts other address without a recipient', () => {
    const result = CardDeliverySchema.safeParse({
      ...validOtherDelivery,
      recipient: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown delivery type', () => {
    const result = CardDeliverySchema.safeParse({ type: 'Pickup' })
    expect(errorPaths(result)).toContain('type')
  })

  it('rejects a missing delivery type', () => {
    const result = CardDeliverySchema.safeParse({})
    expect(errorPaths(result)).toContain('type')
  })

  it('requires address when delivering to another address', () => {
    const result = CardDeliverySchema.safeParse({
      ...validOtherDelivery,
      address: undefined,
    })
    expect(errorPaths(result)).toEqual(['address'])
  })

  it('requires postal code and city when delivering to another address', () => {
    const result = CardDeliverySchema.safeParse({
      ...validOtherDelivery,
      postalCodeAndCity: undefined,
    })
    expect(errorPaths(result)).toEqual(['postalCodeAndCity'])
  })

  it('treats whitespace-only values as missing', () => {
    const result = CardDeliverySchema.safeParse({
      ...validOtherDelivery,
      address: '   ',
      postalCodeAndCity: '  ',
    })
    expect(errorPaths(result)).toEqual(
      expect.arrayContaining(['address', 'postalCodeAndCity']),
    )
  })

  it('ignores other-address fields when delivering to current address', () => {
    const result = CardDeliverySchema.safeParse({
      type: AddressDeliveryType.CURRENT,
      address: '',
      postalCodeAndCity: '',
    })
    expect(result.success).toBe(true)
  })
})
