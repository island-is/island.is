import { InvoiceGroupWithInvoices } from '../models/invoiceGroupWithInvoices.model'

export const MOCK_INVOICE_GROUP_WITH_INVOICES: InvoiceGroupWithInvoices = {
  id: 'group-1',
  supplier: {
    id: 1001,
    name: 'Reykjavík Ráðgjöf ehf.',
    isPrivateProxy: false,
    isConfidential: false,
  },
  customer: {
    id: 2001,
    name: 'Íslenska Byggingafélagið hf.',
  },
  invoices: [
    {
      id: 'invoice-1',
      date: '2023-12-01T00:00:00.000Z',
      totalItemizationAmount: 1250000,
      itemization: [
        {
          id: 'item-1',
          label: 'Ráðgjöf um byggingaverkefni',
          amount: 625000,
        },
        {
          id: 'item-2',
          label: 'Verkefnisstjórnun',
          amount: 625000,
        },
      ],
    },
    {
      id: 'invoice-2',
      date: '2023-12-15T00:00:00.000Z',
      totalItemizationAmount: 1200000,
      itemization: [
        {
          id: 'item-3',
          label: 'Viðbótarráðgjöf',
          amount: 800000,
        },
        {
          id: 'item-4',
          label: 'Skýrslur og greining',
          amount: 400000,
        },
      ],
    },
  ],
}
