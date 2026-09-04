import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { mapInvoiceDto } from './invoice.dto'

const baseData: InvoicePaymentDetailResponseDto = {
  erpInvoiceId: 22136687,
  invoiceNum: '191552084',
  invoiceCurrencyCode: 'ISK',
  invoiceTotalBaseAmountISK: 16161,
  paymentAmountISK: 12683,
  glLines: [],
}

describe('mapInvoiceDto', () => {
  it('sources totalAmount from invoiceTotalBaseAmountISK, not paymentAmountISK', () => {
    const result = mapInvoiceDto(baseData)

    expect(result?.totalAmount).toBe(16161)
  })

  it('sources id from erpInvoiceId, coerced to a string', () => {
    const result = mapInvoiceDto(baseData)

    expect(result?.id).toBe('22136687')
  })

  it('sources number from invoiceNum', () => {
    const result = mapInvoiceDto(baseData)

    expect(result?.number).toBe('191552084')
  })

  it('falls back to 0 when invoiceTotalBaseAmountISK is null', () => {
    const result = mapInvoiceDto({
      ...baseData,
      invoiceTotalBaseAmountISK: null,
    })

    expect(result?.totalAmount).toBe(0)
  })

  it('returns null when erpInvoiceId is missing', () => {
    const result = mapInvoiceDto({ ...baseData, erpInvoiceId: undefined })

    expect(result).toBeNull()
  })

  it('returns null when invoiceNum is missing', () => {
    const result = mapInvoiceDto({ ...baseData, invoiceNum: null })

    expect(result).toBeNull()
  })

  it('returns null when invoiceCurrencyCode is missing', () => {
    const result = mapInvoiceDto({ ...baseData, invoiceCurrencyCode: null })

    expect(result).toBeNull()
  })
})
