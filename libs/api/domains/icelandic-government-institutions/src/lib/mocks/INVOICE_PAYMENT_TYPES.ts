import { InvoicePaymentTypes } from '../models/invoicePaymentTypes.model'

export const MOCK_INVOICE_PAYMENT_TYPES: InvoicePaymentTypes = {
  data: [
    {
      id: 'BANK_TRANSFER',
      name: 'Millifrsla',
      accountType: 'CHECKING',
      isConfidential: false,
    },
    {
      id: 'CREDIT_CARD',
      name: 'Kreditkort',
      accountType: 'CREDIT',
      isConfidential: false,
    },
    {
      id: 'DEBIT_CARD',
      name: 'Debetkort',
      accountType: 'DEBIT',
      isConfidential: false,
    },
    {
      id: 'DIRECT_DEBIT',
      name: 'Bein skuldfrsla',
      accountType: 'CHECKING',
      isConfidential: false,
    },
    {
      id: 'CASH',
      name: 'Reif',
      isConfidential: false,
    },
  ],
  totalCount: 5,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
