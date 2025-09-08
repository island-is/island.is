import { defineMessages } from 'react-intl'

export const m = defineMessages({
  payments: {
    id: 'admin-portal.payments:payments',
    defaultMessage: 'Greiðslur',
  },
  paymentsDescription: {
    id: 'admin-portal.payments:payments-description',
    defaultMessage: 'Þjónustuborð fyrir greiðslur',
  },
  payment: {
    id: 'admin-portal.payments:payment',
    defaultMessage: 'Greiðsluflæði',
  },
  paymentDescription: {
    id: 'admin-portal.payments:payment-description',
    defaultMessage: 'Upplýsingar um greiðslu og atvik',
  },
  payer: {
    id: 'admin-portal.payments:payer',
    defaultMessage: '{name} kt. {nationalId}',
  },
  searchBy: {
    id: 'admin-portal.payments:search-by',
    defaultMessage: 'Leita eftir greiðsluflæðis id eða kennitölu.',
  },
  listPayments: {
    id: 'admin-portal.payments:list-payments',
    defaultMessage: 'Listi af greiðslum:',
  },
  viewDetails: {
    id: 'admin-portal.payments:view-details',
    defaultMessage: 'Skoða nánar',
  },
  noContent: {
    id: 'admin-portal.payments:no-content',
    defaultMessage: 'Engar greiðslur fundust fyrir þennan leitarstreng',
  },
  errorDefault: {
    id: 'admin-portal.payments:error-default',
    defaultMessage: 'Oops, an unknown error has occurred.',
  },
  events: {
    id: 'admin-portal.payments:events',
    defaultMessage: 'Atvik',
  },
  loadMore: {
    id: 'admin-portal.payments:load-more',
    defaultMessage: 'Sjá meira',
  },
  invalidSearchInput: {
    id: 'admin-portal.payments:invalid-search-input',
    defaultMessage: 'Ógildur leitarstrengur',
  },
  noPaymentsFound: {
    id: 'admin-portal.payments:no-payments-found',
    defaultMessage: 'Engar greiðslur fundust',
  },
  create: {
    id: 'admin-portal.payments:eventTypeCreate',
    defaultMessage: 'Búið til',
  },
  update: {
    id: 'admin-portal.payments:eventTypeUpdate',
    defaultMessage: 'Uppfærsla',
  },
  deleted: {
    id: 'admin-portal.payments:eventTypeDeleted',
    defaultMessage: 'Eytt',
  },
  error: {
    id: 'admin-portal.payments:eventTypeError',
    defaultMessage: 'Villa',
  },
  success: {
    id: 'admin-portal.payments:eventTypeSuccess',
    defaultMessage: 'Tókst',
  },
  paid: {
    id: 'admin-portal.payments:statusPaid',
    defaultMessage: 'Greitt',
  },
  unpaid: {
    id: 'admin-portal.payments:statusUnpaid',
    defaultMessage: 'Ógreitt',
  },
  invoice_pending: {
    id: 'admin-portal.payments:statusInvoicePending',
    defaultMessage: 'Reikningur í vinnslu',
  },
  unknown: {
    id: 'admin-portal.payments:statusUnknown',
    defaultMessage: 'Óþekkt',
  },
  date: {
    id: 'admin-portal.payments:date',
    defaultMessage: 'Dagsetning',
  },
  time: {
    id: 'admin-portal.payments:time',
    defaultMessage: 'Tími',
  },
  type: {
    id: 'admin-portal.payments:type',
    defaultMessage: 'Tegund',
  },
  info: {
    id: 'admin-portal.payments:info',
    defaultMessage: 'Skilaboð',
  },
})
