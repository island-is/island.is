import { buildCardPayInfo } from './cardPayment.utils'

describe('buildCardPayInfo', () => {
  const input = {
    cardChargeInfo: {
      maskedCardNumber: '****1234',
      authorizationCode: 'auth-1',
      cardScheme: 'Visa',
    },
    totalPrice: 1500,
    merchantReferenceData: 'rrn-1',
    correlationId: 'correlation-1',
  }

  it.each([
    ['debit', 'debit'],
    ['Debit', 'debit'],
    ['credit', 'credit'],
    [undefined, 'credit'],
  ])('treats card usage %s as %s', (cardUsage, kind) => {
    expect(
      buildCardPayInfo({
        ...input,
        cardChargeInfo: { ...input.cardChargeInfo, cardUsage },
      }).kind,
    ).toBe(kind)
  })

  it('uses the masked number as PAN and the merchant reference as RRN', () => {
    expect(buildCardPayInfo(input)).toEqual({
      kind: 'credit',
      PAN: '****1234',
      RRN: 'rrn-1',
      authCode: 'auth-1',
      cardType: 'Visa',
      payableAmount: 1500,
      correlationId: 'correlation-1',
    })
  })
})
