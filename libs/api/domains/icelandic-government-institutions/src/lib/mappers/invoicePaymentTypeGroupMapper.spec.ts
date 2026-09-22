import { InvoicePaymentTypeGroupDto } from '@island.is/clients/government-invoices'
import { mapInvoicePaymentTypeGroup } from './invoicePaymentTypeGroupMapper'

const baseData: InvoicePaymentTypeGroupDto = {
  name: 'Ferðakostnaður',
  codes: ['A12', 'A13', 'B04'],
  codeCount: 3,
}

describe('mapInvoicePaymentTypeGroup', () => {
  it('derives a stable id for identical content', () => {
    const first = mapInvoicePaymentTypeGroup(baseData)
    const second = mapInvoicePaymentTypeGroup({ ...baseData })

    expect(first.id).toBe(second.id)
  })

  it('derives the same id regardless of the order codes arrive in', () => {
    const ascending = mapInvoicePaymentTypeGroup(baseData)
    const shuffled = mapInvoicePaymentTypeGroup({
      ...baseData,
      codes: ['B04', 'A12', 'A13'],
    })

    expect(shuffled.id).toBe(ascending.id)
  })

  it('derives a different id when the codes change', () => {
    const original = mapInvoicePaymentTypeGroup(baseData)
    const extended = mapInvoicePaymentTypeGroup({
      ...baseData,
      codes: [...baseData.codes, 'C01'],
    })

    expect(extended.id).not.toBe(original.id)
  })

  it('derives a different id when the name changes', () => {
    const original = mapInvoicePaymentTypeGroup(baseData)
    const renamed = mapInvoicePaymentTypeGroup({
      ...baseData,
      name: 'Annar kostnaður',
    })

    expect(renamed.id).not.toBe(original.id)
  })

  it('passes codeCount through without deriving it from codes', () => {
    const result = mapInvoicePaymentTypeGroup({
      ...baseData,
      codeCount: undefined,
    })

    expect(result.codeCount).toBeUndefined()
  })

  it('passes l3CategoryName through when present', () => {
    const result = mapInvoicePaymentTypeGroup({
      ...baseData,
      l3CategoryName: 'Ferðir',
    })

    expect(result.l3CategoryName).toBe('Ferðir')
  })

  it('defaults l3CategoryName to undefined when absent', () => {
    const result = mapInvoicePaymentTypeGroup(baseData)

    expect(result.l3CategoryName).toBeUndefined()
  })
})
