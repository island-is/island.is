import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { mapPaymentDto } from './payment.dto'

const baseData: InvoicePaymentDetailResponseDto = {
  paymentGuid: '00000000-0000-0000-0000-000000000003',
  paymentAccountingDate: '2025-02-07',
  paymentCurrencyCode: 'ISK',
  paymentAmountISK: 12683,
  invoiceGuid: '00000000-0000-0000-0000-000000000002',
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

  it('sources id from paymentGuid', () => {
    const result = mapPaymentDto(baseData)

    expect(result?.id).toBe('00000000-0000-0000-0000-000000000003')
  })

  it('returns null when paymentAmountISK is null', () => {
    const result = mapPaymentDto({ ...baseData, paymentAmountISK: null })

    expect(result).toBeNull()
  })

  it('maps successfully when paymentAmountISK is 0', () => {
    const result = mapPaymentDto({ ...baseData, paymentAmountISK: 0 })

    expect(result?.amount).toBe(0)
  })

  it('returns null when paymentGuid is missing', () => {
    const result = mapPaymentDto({
      ...baseData,
      paymentGuid: undefined,
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

  it('maps a payment when both currency codes are missing', () => {
    const result = mapPaymentDto({
      ...baseData,
      paymentCurrencyCode: null,
      invoiceCurrencyCode: null,
    })

    expect(result?.id).toBe('00000000-0000-0000-0000-000000000003')
    expect(result?.invoice.id).toBe('00000000-0000-0000-0000-000000000002')
  })

  it('returns null when the nested invoice fails to map (cascading drop)', () => {
    const result = mapPaymentDto({ ...baseData, invoiceNum: null })

    expect(result).toBeNull()
  })

  it('nests the mapped invoice', () => {
    const result = mapPaymentDto(baseData)

    expect(result?.invoice).toEqual({
      id: '00000000-0000-0000-0000-000000000002',
      number: '191552084',
      numberRedacted: false,
      totalAmount: 16161,
      itemization: [],
    })
  })
})
