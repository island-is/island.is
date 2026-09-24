import { OpenInvoicesGroupCollectionResponseDto } from '../../../gen/fetch'
import { mapInvoicePaymentsGroupCollectionDto } from './invoicePaymentsGroupCollection.dto'

const baseData: OpenInvoicesGroupCollectionResponseDto = {
  totalCount: 2,
  totalPaymentsSum: 1000,
  totalPaymentsCount: 3,
  invoiceGroups: [],
}

describe('mapInvoicePaymentsGroupCollectionDto', () => {
  it('falls back to 0 when the payment totals are missing', () => {
    const result = mapInvoicePaymentsGroupCollectionDto({
      ...baseData,
      totalPaymentsSum: undefined,
      totalPaymentsCount: undefined,
    })

    expect(result?.totalPaymentsSum).toBe(0)
    expect(result?.totalPaymentsCount).toBe(0)
  })

  it('returns null when totalCount is missing', () => {
    const result = mapInvoicePaymentsGroupCollectionDto({
      ...baseData,
      totalCount: undefined,
    })

    expect(result).toBeNull()
  })
})
