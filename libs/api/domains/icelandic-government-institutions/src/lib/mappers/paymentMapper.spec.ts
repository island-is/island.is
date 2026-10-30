import { PaymentDto } from '@island.is/clients/government-invoices'
import { mapPayment } from './paymentMapper'

describe('mapPayment', () => {
  it('traces Payment.amount and Payment.invoice.totalAmount to their correct, distinct sources', () => {
    const data: PaymentDto = {
      id: '18708645',
      date: new Date('2025-02-07'),
      amount: 12683,
      originalAmount: 12683,
      currencyCode: 'ISK',
      invoice: {
        id: '22136687',
        number: '191552084',
        totalAmount: 16161,
        originalTotalAmount: 16161,
        currencyCode: 'ISK',
        itemization: [],
      },
    }

    const result = mapPayment(data)

    expect(result.amount).toBe(12683)
    expect(result.invoice.totalAmount).toBe(16161)
  })

  it('maps id, date, and invoice.id/invoice.number straight through', () => {
    const date = new Date('2025-02-07')
    const data: PaymentDto = {
      id: '18708645',
      date,
      amount: 12683,
      originalAmount: 12683,
      currencyCode: 'ISK',
      invoice: {
        id: '22136687',
        number: '191552084',
        totalAmount: 16161,
        originalTotalAmount: 16161,
        currencyCode: 'ISK',
        itemization: [],
      },
    }

    const result = mapPayment(data)

    expect(result.id).toBe('18708645')
    expect(result.date).toBe(date)
    expect(result.invoice.id).toBe('22136687')
    expect(result.invoice.number).toBe('191552084')
  })

  describe('isPartialPayment', () => {
    const base: PaymentDto = {
      id: '18708645',
      date: new Date('2026-08-31'),
      amount: 63315157,
      originalAmount: 448122,
      currencyCode: 'EUR',
      invoice: {
        id: '22136687',
        number: '11472',
        totalAmount: 63902197,
        originalTotalAmount: 448122,
        currencyCode: 'EUR',
        itemization: [],
      },
    }

    it.each([
      ['EUR', 448122, 'EUR', 448122, false],
      ['EUR', 100, 'EUR', 250, true],
      ['EUR', 100, 'USD', 250, false],
      [null, 100, null, 250, false],
      ['', 100, '', 250, false],
      ['EUR', 100, '', 250, false],
      ['EUR', 100, null, 250, false],
      ['EUR', null, 'EUR', 250, false],
      ['EUR', 100, 'EUR', null, false],
    ])(
      'payment %s %s vs invoice %s %s → %s',
      (
        currencyCode: string | null,
        originalAmount: number | null,
        invoiceCurrencyCode: string | null,
        originalTotalAmount: number | null,
        expected: boolean,
      ) => {
        const result = mapPayment({
          ...base,
          currencyCode,
          originalAmount,
          invoice: {
            ...base.invoice,
            currencyCode: invoiceCurrencyCode,
            originalTotalAmount,
          },
        })

        expect(result.isPartialPayment).toBe(expected)
      },
    )
  })
})
