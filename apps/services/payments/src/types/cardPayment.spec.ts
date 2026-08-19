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

  it('accepts an approved charge with null marketName', () => {
    const result = CardPaymentSuccessSchema.safeParse({
      ...approvedCharge,
      marketInformation: {
        merchantCountry: 'IS',
        marketName: null,
        acquirerRegion: 'EU',
      },
    })

    expect(result.success).toBe(true)
  })

  it('accepts an approved charge without market information', () => {
    const result = CardPaymentSuccessSchema.safeParse(approvedCharge)

    expect(result.success).toBe(true)
  })
})
