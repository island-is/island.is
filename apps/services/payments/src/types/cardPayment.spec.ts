import {
  CardPaymentSuccessSchema,
  GooglePayWalletTransactionSuccessSchema,
  RefundSuccessSchema,
} from './cardPayment'

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

  it('keeps the masked card number the gateway sends', () => {
    const result = CardPaymentSuccessSchema.parse({
      ...approvedCharge,
      lastFourInPan: '9999',
    })

    expect(result.maskedCardNumber).toBe('545721******0001')
  })

  describe('an approved wallet charge without a masked card number', () => {
    const walletCharge: Partial<typeof approvedCharge> = { ...approvedCharge }
    delete walletCharge.maskedCardNumber

    it('is accepted with the last four digits in its place', () => {
      const result = CardPaymentSuccessSchema.parse({
        ...walletCharge,
        lastFourInPan: '0001',
      })

      expect(result.maskedCardNumber).toBe('************0001')
      expect(result).not.toHaveProperty('lastFourInPan')
    })

    it('is accepted with an empty masked card number when the last four digits are missing too', () => {
      const result = CardPaymentSuccessSchema.parse(walletCharge)

      expect(result.maskedCardNumber).toBe('')
    })

    it('is a charged Google Pay wallet transaction', () => {
      const result = GooglePayWalletTransactionSuccessSchema.parse(walletCharge)

      expect(result).not.toHaveProperty('googlePayCardInformation')
      expect(result).toMatchObject({
        responseCode: '00-I',
        transactionID: 'txn',
        maskedCardNumber: '',
      })
    })
  })
})

describe('RefundSuccessSchema', () => {
  it('accepts an approved refund without a masked card number', () => {
    const result = RefundSuccessSchema.safeParse({
      isSuccess: true,
      responseCode: '00-I',
      responseTime: '00:00:01',
      correlationID: '514ca62a-de5a-4ec6-88d5-0484ac8d7a6c',
      acquirerReferenceNumber: 'arn',
      transactionID: 'txn',
      transactionLifecycleId: 'tlc',
      cardInformation: {
        cardScheme: 'M',
        cardUsage: 'Credit',
      },
      authorizationIdentifier: 'authId',
    })

    expect(result.success).toBe(true)
  })

  it('accepts an approved refund with only the fields the gateway answered refunds with on 19 Nov 2026', () => {
    const result = RefundSuccessSchema.safeParse({
      transactionID: 'txn',
      transactionLifecycleId: 'tlc',
      isSuccess: true,
      cardInformation: {
        cardScheme: 'M',
        cardUsage: 'Credit',
      },
      isCardPresent: false,
      refundOperation: 'Refund',
      authenticationMethod: 'NONE',
      authorizedAmount: 380000,
      responseCode: '00-I',
      responseDescription: 'Approved or completed successfully',
      responseTime: '17:52:07',
      correlationID: '514ca62a-de5a-4ec6-88d5-0484ac8d7a6c',
    })

    expect(result.success).toBe(true)
  })

  it('does not take a declined refund for an approved one', () => {
    const result = RefundSuccessSchema.safeParse({
      isSuccess: false,
      responseCode: '05-I',
      responseTime: '17:52:07',
      correlationID: '514ca62a-de5a-4ec6-88d5-0484ac8d7a6c',
    })

    expect(result.success).toBe(false)
  })
})
