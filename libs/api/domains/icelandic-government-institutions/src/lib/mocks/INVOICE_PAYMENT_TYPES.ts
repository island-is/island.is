import { InvoicePaymentTypes } from '../models/invoicePaymentTypes.model'

export const MOCK_INVOICE_PAYMENT_TYPES: InvoicePaymentTypes = {
  data: [
    {
      code: 'BANK_TRANSFER',
      name: 'Millifrsla',
      accountType: 'CHECKING',
      isConfidential: false,
    },
    {
      code: 'CREDIT_CARD',
      name: 'Kreditkort',
      accountType: 'CREDIT',
      isConfidential: false,
    },
    {
      code: 'DEBIT_CARD',
      name: 'Debetkort',
      accountType: 'DEBIT',
      isConfidential: false,
    },
    {
      code: 'DIRECT_DEBIT',
      name: 'Bein skuldfrsla',
      accountType: 'CHECKING',
      isConfidential: false,
    },
    {
      code: 'CASH',
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
