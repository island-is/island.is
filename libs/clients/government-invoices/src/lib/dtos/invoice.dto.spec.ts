import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { mapInvoiceDto } from './invoice.dto'

const baseData: InvoicePaymentDetailResponseDto = {
  invoiceGuid: '00000000-0000-0000-0000-000000000002',
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

  it('sources id from invoiceGuid', () => {
    const result = mapInvoiceDto(baseData)

    expect(result?.id).toBe('00000000-0000-0000-0000-000000000002')
  })

  it('sources number from invoiceNum', () => {
    const result = mapInvoiceDto(baseData)

    expect(result?.number).toBe('191552084')
  })

  it('returns null when invoiceTotalBaseAmountISK is null', () => {
    const result = mapInvoiceDto({
      ...baseData,
      invoiceTotalBaseAmountISK: null,
    })

    expect(result?.totalAmount).toBeNull()
  })

  it('returns null when invoiceGuid is missing', () => {
    const result = mapInvoiceDto({ ...baseData, invoiceGuid: undefined })

    expect(result).toBeNull()
  })

  it.each([null, undefined])(
    'keeps an invoice when invoiceNum is %s',
    (invoiceNum) => {
      const result = mapInvoiceDto({ ...baseData, invoiceNum })

      expect(result).not.toBeNull()
      expect(result?.number).toBeNull()
      expect(result?.totalAmount).toBe(16161)
    },
  )

  it('maps an invoice when invoiceCurrencyCode is missing', () => {
    const result = mapInvoiceDto({ ...baseData, invoiceCurrencyCode: null })

    expect(result?.id).toBe('00000000-0000-0000-0000-000000000002')
  })
})
