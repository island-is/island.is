import { defineMessages } from 'react-intl'

export const directTaxPaymentModal = {
  general: defineMessages({
    headline: {
      id: 'fa.application:section.directTaxPaymentModal.general.headline',
      defaultMessage: 'Staðgreiðsluskrá',
      description: 'Direct payments headline in modal',
    },
    close: {
      id: 'fa.application:section.directTaxPaymentModal.general.close',
      defaultMessage: 'Loka',
      description: 'Button text to close modal',
    },
  }),
  taxBreakdown: defineMessages({
    empty: {
      id: 'fa.application:section.directTaxPaymentModal.taxBreakdown.empty',
      defaultMessage: 'Engin staðgreiðsla',
      description:
        'In tax break down when there is no direct payments for that month',
    },
    company: {
      id: 'fa.application:section.directTaxPaymentModal.taxBreakdown.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Headers in tax breakdown, company',
    },
    totalSalary: {
      id: 'fa.application:section.directTaxPaymentModal.taxBreakdown.totalSalary',
      defaultMessage: 'Heildarlaun',
      description: 'Headers in tax breakdown, total salary',
    },
    personalAllowance: {
      id: 'fa.application:section.directTaxPaymentModal.taxBreakdown.personalAllowance',
      defaultMessage: 'Persónuafsláttur',
      description: 'Headers in tax breakdown, personal allowance',
    },
    withheldAtSource: {
      id: 'fa.application:section.directTaxPaymentModal.taxBreakdown.withheldAtSource',
      defaultMessage: 'Staðgreiðsla',
      description: 'Headers in tax breakdown, with held at source',
    },
  }),
}
