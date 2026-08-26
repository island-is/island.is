import { InvoicePaymentsGroupDto } from '@island.is/clients/government-invoices'
import { mapInvoicePaymentsGroup } from './invoicePaymentsGroupMapper'

describe('mapInvoicePaymentsGroup', () => {
  it('populates totalPaymentsSum, totalPaymentsCount, and payments from the correspondingly-named dto fields', () => {
    const data: InvoicePaymentsGroupDto = {
      supplier: {
        legalId: '7012966139',
        name: 'Íslandspóstur ohf.',
        isConfidential: false,
        isPrivatePerson: false,
        isPrivatePersonProxy: false,
      },
      debtor: {
        legalId: '5309672079',
        erpLegalEntityId: 22136687,
        name: 'Ríkislögreglustjóri',
      },
      totalPaymentsSum: 14662240,
      totalPaymentsCount: 3,
      payments: [
        {
          id: '18708645',
          date: new Date('2025-02-07'),
          amount: 12683,
          invoice: {
            id: '22136687',
            number: '191552084',
            totalAmount: 12683,
            itemization: [],
          },
        },
      ],
    }

    const result = mapInvoicePaymentsGroup(data)

    expect(result.totalPaymentsSum).toBe(14662240)
    expect(result.totalPaymentsCount).toBe(3)
    expect(result.payments).toHaveLength(1)
    expect(result.payments?.[0].id).toBe('18708645')
  })
})
