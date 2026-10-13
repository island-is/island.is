import { PaymentMethod } from '../types'
import {
  formatFjsDebtPaymentDate,
  parsePaymentOptions,
  toFjsDebtPayInfo,
  toFjsPaymentMeans,
} from './fjsDebtPayment'

describe('parsePaymentOptions', () => {
  it('maps CARD;TRANSFER to card and bank transfer', () => {
    expect(parsePaymentOptions('CARD;TRANSFER')).toEqual(
      new Set([PaymentMethod.CARD, PaymentMethod.BANK_TRANSFER]),
    )
  })

  it('maps CARD to card only', () => {
    expect(parsePaymentOptions('CARD')).toEqual(new Set([PaymentMethod.CARD]))
  })

  it('maps TRANSFER to bank transfer only', () => {
    expect(parsePaymentOptions('TRANSFER')).toEqual(
      new Set([PaymentMethod.BANK_TRANSFER]),
    )
  })

  it('returns an empty set for an empty, null or undefined string', () => {
    expect(parsePaymentOptions('').size).toBe(0)
    expect(parsePaymentOptions(null).size).toBe(0)
    expect(parsePaymentOptions(undefined).size).toBe(0)
  })

  it('ignores case and whitespace, and accepts commas', () => {
    expect(parsePaymentOptions('card ; transfer')).toEqual(
      new Set([PaymentMethod.CARD, PaymentMethod.BANK_TRANSFER]),
    )
    expect(parsePaymentOptions(' Card,Transfer ')).toEqual(
      new Set([PaymentMethod.CARD, PaymentMethod.BANK_TRANSFER]),
    )
  })

  it('ignores unknown tokens and reports them', () => {
    const onUnknownToken = jest.fn()

    expect(parsePaymentOptions('CARD;CLAIM;;', onUnknownToken)).toEqual(
      new Set([PaymentMethod.CARD]),
    )
    expect(onUnknownToken).toHaveBeenCalledTimes(1)
    expect(onUnknownToken).toHaveBeenCalledWith('CLAIM')
  })

  it('never maps to invoice', () => {
    expect(parsePaymentOptions('CLAIM').size).toBe(0)
  })
})

describe('toFjsPaymentMeans', () => {
  it.each([
    ['debit', 'DebetCard'],
    ['credit', 'KreditCard'],
    ['transfer', 'Transfer'],
  ] as const)('maps %s to %s', (kind, expected) => {
    expect(toFjsPaymentMeans(kind)).toBe(expected)
  })
})

describe('formatFjsDebtPaymentDate', () => {
  it('formats as yyyy-MM-dd', () => {
    expect(formatFjsDebtPaymentDate(new Date(2026, 9, 5, 14, 30))).toBe(
      '2026-10-05',
    )
  })
})

describe('toFjsDebtPayInfo', () => {
  it('replaces the neutral kind with the FJS payment means', () => {
    expect(
      toFjsDebtPayInfo({
        kind: 'debit',
        RRN: 'rrn',
        PAN: '****1234',
        authCode: 'auth',
        cardType: 'Visa',
        payableAmount: 1000,
        correlationId: 'correlation',
      }),
    ).toEqual({
      paymentMeans: 'DebetCard',
      RRN: 'rrn',
      PAN: '****1234',
      authCode: 'auth',
      cardType: 'Visa',
      payableAmount: 1000,
      correlationId: 'correlation',
    })
  })
})
