import { CardPaymentSuccessSchema } from './cardPayment'

describe('CardPaymentSuccessSchema', () => {
  const approvedCharge = {
    isSuccess: true,
    responseCode: '00-I',
    responseDescription: 'Approved or completed successfully',
    responseTime: '00:00:01',
    correlationID: '514ca62a-de5a-4ec6-88d5-0484ac8d7a6c',
    acquirerReferenceNumber: 'arn',
    transactionID: 'txn',
    authorizationCode: 'auth',
    transactionLifecycleId: 'tlc',
    maskedCardNumber: '545721******0001',
    cardInformation: {
      cardScheme: 'M',
      cardUsage: 'Credit',
    },
    authorizationIdentifier: 'authId',
  }

  const fullMarketInformation = {
    merchantCountry: 'IS',
    marketName: 'Iceland',
    acquirerRegion: 'EU',
  }

  it.each(['merchantCountry', 'marketName', 'acquirerRegion'] as const)(
    'accepts an approved charge with null %s',
    (field) => {
      const result = CardPaymentSuccessSchema.safeParse({
        ...approvedCharge,
        marketInformation: { ...fullMarketInformation, [field]: null },
      })

      expect(result.success).toBe(true)
    },
  )

  it.each(['merchantCountry', 'marketName', 'acquirerRegion'] as const)(
    'accepts an approved charge with omitted %s',
    (field) => {
      const { [field]: _omitted, ...partialMarketInformation } =
        fullMarketInformation

      const result = CardPaymentSuccessSchema.safeParse({
        ...approvedCharge,
        marketInformation: partialMarketInformation,
      })

      expect(result.success).toBe(true)
    },
  )

  it('accepts an approved charge with all market information fields null', () => {
    const result = CardPaymentSuccessSchema.safeParse({
      ...approvedCharge,
      marketInformation: {
        merchantCountry: null,
        marketName: null,
        acquirerRegion: null,
      },
    })

    expect(result.success).toBe(true)
  })

  it('accepts an approved charge without market information', () => {
    const result = CardPaymentSuccessSchema.safeParse(approvedCharge)

    expect(result.success).toBe(true)
  })
})
