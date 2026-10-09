import { OpenInvoicesGroupCollectionResponseDto } from '../../../gen/fetch'
import { mapInvoicePaymentsGroupCollectionDto } from './invoicePaymentsGroupCollection.dto'

const baseData: OpenInvoicesGroupCollectionResponseDto = {
  totalCount: 2,
  totalPaymentsSum: 1000,
  totalPaymentsCount: 3,
  invoiceGroups: [],
}

describe('mapInvoicePaymentsGroupCollectionDto', () => {
  it('keeps a missing sum unknown and falls back to 0 for a missing count', () => {
    const result = mapInvoicePaymentsGroupCollectionDto({
      ...baseData,
      totalPaymentsSum: undefined,
      totalPaymentsCount: undefined,
    })

    expect(result?.totalPaymentsSum).toBeNull()
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
