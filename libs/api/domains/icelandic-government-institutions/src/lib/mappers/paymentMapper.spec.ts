import { PaymentDto } from '@island.is/clients/government-invoices'
import { mapPayment } from './paymentMapper'

describe('mapPayment', () => {
  it('traces Payment.amount and Payment.invoice.totalAmount to their correct, distinct sources', () => {
    const data: PaymentDto = {
      id: '18708645',
      date: new Date('2025-02-07'),
      amount: 12683,
      invoice: {
        id: '22136687',
        number: '191552084',
        totalAmount: 16161,
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
      invoice: {
        id: '22136687',
        number: '191552084',
        totalAmount: 16161,
        itemization: [],
      },
    }

    const result = mapPayment(data)

    expect(result.id).toBe('18708645')
    expect(result.date).toBe(date)
    expect(result.invoice.id).toBe('22136687')
    expect(result.invoice.number).toBe('191552084')
  })
})
