import { InvoicePaymentsGroupDto } from '@island.is/clients/government-invoices'
import { mapInvoicePaymentsGroup } from './invoicePaymentsGroupMapper'
import { ContentFilters } from '../utils/invoicePaymentsGroupId'

const baseDto: InvoicePaymentsGroupDto = {
  supplier: {
    legalId: '1234567890',
    name: 'Íslandspóstur ohf.',
    isConfidential: false,
    isPrivatePerson: false,
    isPrivatePersonProxy: false,
  },
  debtor: {
    legalId: '5309672079',
    debtorGuid: '3f2a9c1e-6b4d-4e8a-9f7c-2d1e5b8a4c60',
    name: 'Ríkislögreglustjóri',
  },
  totalPaymentsSum: 14662240,
  totalPaymentsCount: 3,
  payments: [],
}

const baseFilters: ContentFilters = {
  dateFrom: new Date('2025-01-01'),
  dateTo: new Date('2025-12-31'),
  paymentTypeIds: ['A', 'B'],
  ministries: ['01', '02'],
}

const idFor = (scope: 'list' | 'detail', filters: ContentFilters) =>
  mapInvoicePaymentsGroup(baseDto, scope, filters).id

describe('mapInvoicePaymentsGroup', () => {
  it('populates totalPaymentsSum, totalPaymentsCount, and payments from the correspondingly-named dto fields', () => {
    const data: InvoicePaymentsGroupDto = {
      supplier: {
        legalId: '1234567890',
        name: 'Íslandspóstur ohf.',
        isConfidential: false,
        isPrivatePerson: false,
        isPrivatePersonProxy: false,
      },
      debtor: {
        legalId: '5309672079',
        debtorGuid: '3f2a9c1e-6b4d-4e8a-9f7c-2d1e5b8a4c60',
        name: 'Ríkislögreglustjóri',
      },
      totalPaymentsSum: 14662240,
      totalPaymentsCount: 3,
      payments: [
        {
          id: 'a1b2c3d4-0000-4000-8000-000000000001',
          date: new Date('2025-02-07'),
          amount: 12683,
          invoice: {
            id: 'a1b2c3d4-0000-4000-8000-000000000002',
            number: '191552084',
            numberRedacted: false,
            totalAmount: 12683,
            itemization: [],
          },
        },
      ],
    }

    const result = mapInvoicePaymentsGroup(data, 'detail', {})

    expect(result.totalPaymentsSum).toBe(14662240)
    expect(result.totalPaymentsCount).toBe(3)
    expect(result.payments).toHaveLength(1)
    expect(result.payments?.[0].id).toBe('a1b2c3d4-0000-4000-8000-000000000001')
  })

  describe('id fingerprint', () => {
    it('is stable for the same filters', () => {
      expect(idFor('list', baseFilters)).toBe(idFor('list', baseFilters))
    })

    it('is unaffected by the order of paymentTypeIds and ministries', () => {
      const reversed: ContentFilters = {
        ...baseFilters,
        paymentTypeIds: ['B', 'A'],
        ministries: ['02', '01'],
      }

      expect(idFor('list', reversed)).toBe(idFor('list', baseFilters))
    })

    it('does not mutate the caller filter arrays', () => {
      const paymentTypeIds = ['B', 'A']
      idFor('list', { ...baseFilters, paymentTypeIds })

      expect(paymentTypeIds).toEqual(['B', 'A'])
    })

    it.each([
      ['paymentTypeIds', { paymentTypeIds: ['A'] }],
      ['ministries', { ministries: ['01'] }],
      ['dateFrom', { dateFrom: new Date('2025-02-01') }],
      ['dateTo', { dateTo: new Date('2025-11-30') }],
    ])('changes when %s changes', (_label, override) => {
      expect(idFor('list', { ...baseFilters, ...override })).not.toBe(
        idFor('list', baseFilters),
      )
    })

    it('differs between list and detail scopes for identical filters', () => {
      expect(idFor('detail', baseFilters)).not.toBe(idFor('list', baseFilters))
    })
  })
})
