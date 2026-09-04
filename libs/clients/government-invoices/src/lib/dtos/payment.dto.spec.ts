import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { mapPaymentDto } from './payment.dto'

const baseData: InvoicePaymentDetailResponseDto = {
  erpInvoicePaymentId: 18708645,
  paymentAccountingDate: '2025-02-07',
  paymentCurrencyCode: 'ISK',
  paymentAmountISK: 12683,
  erpInvoiceId: 22136687,
  invoiceNum: '191552084',
  invoiceCurrencyCode: 'ISK',
  invoiceTotalBaseAmountISK: 16161,
  glLines: [],
}

describe('mapPaymentDto', () => {
  it('sources amount from paymentAmountISK, not paymentAmount or invoiceTotalBaseAmountISK', () => {
    const result = mapPaymentDto(baseData)

    expect(result?.amount).toBe(12683)
  })

  it('sources id from erpInvoicePaymentId, coerced to a string', () => {
    const result = mapPaymentDto(baseData)

    expect(result?.id).toBe('18708645')
  })

  it('maps successfully when erpInvoicePaymentId is 0', () => {
    const result = mapPaymentDto({ ...baseData, erpInvoicePaymentId: 0 })

    expect(result?.id).toBe('0')
  })

  it('falls back to 0 when paymentAmountISK is null', () => {
    const result = mapPaymentDto({ ...baseData, paymentAmountISK: null })

    expect(result?.amount).toBe(0)
  })

  it('returns null when erpInvoicePaymentId is missing', () => {
    const result = mapPaymentDto({
      ...baseData,
      erpInvoicePaymentId: undefined,
    })

    expect(result).toBeNull()
  })

  it('returns null when paymentAccountingDate is missing', () => {
    const result = mapPaymentDto({
      ...baseData,
      paymentAccountingDate: undefined,
    })

    expect(result).toBeNull()
  })

  it('returns null when paymentCurrencyCode is missing', () => {
    const result = mapPaymentDto({ ...baseData, paymentCurrencyCode: null })

    expect(result).toBeNull()
  })

  it('returns null when the nested invoice fails to map (cascading drop)', () => {
    const result = mapPaymentDto({ ...baseData, invoiceNum: null })

    expect(result).toBeNull()
  })

  it('nests the mapped invoice', () => {
    const result = mapPaymentDto(baseData)

    expect(result?.invoice).toEqual({
      id: '22136687',
      number: '191552084',
      totalAmount: 16161,
      itemization: [],
    })
  })
})
