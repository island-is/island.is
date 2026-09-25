import { OpenInvoiceGroupResponseDto } from '../../../gen/fetch'
import { mapInvoicePaymentsGroupDto } from './invoicePaymentsGroup.dto'

const baseData: OpenInvoiceGroupResponseDto = {
  supplier: {
    legalId: 'supplier-1',
    name: 'Supplier',
    isPrivatePerson: false,
    isPrivatePersonProxy: false,
    isConfidential: false,
  },
  debtor: {
    erpLegalEntityId: 1,
    name: 'Debtor',
  },
  totalPaymentsSum: 1000,
  totalPaymentCount: 3,
}

describe('mapInvoicePaymentsGroupDto', () => {
  it('falls back to 0 when totalPaymentCount is missing', () => {
    const result = mapInvoicePaymentsGroupDto({
      ...baseData,
      totalPaymentCount: undefined,
    })

    expect(result?.totalPaymentsCount).toBe(0)
  })

  it('returns null when totalPaymentsSum is missing', () => {
    const result = mapInvoicePaymentsGroupDto({
      ...baseData,
      totalPaymentsSum: undefined,
    })

    expect(result).toBeNull()
  })
})
