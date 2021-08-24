import { defineMessages } from 'react-intl'

export const errorModal = defineMessages({
  maxDebt: {
    id: `pdpp.application:application.errorModal.maxDebt`,
    defaultMessage: 'Skuldar of mikið',
    description: 'Owes to much',
  },
  taxReturns: {
    id: `pdpp.application:application.errorModal.taxReturns`,
    defaultMessage: 'Ekki búinn að skila skattaskýrslu',
    description: 'Tax return not submitted',
  },
  vatReturns: {
    id: `pdpp.application:application.errorModal.vatReturns`,
    defaultMessage: 'Ekki búinn að skila vat',
    description: 'VAT not submitted',
  },
  citReturns: {
    id: `pdpp.application:application.errorModal.citReturns`,
    defaultMessage: 'Ekki búið að skila cit',
    description: 'Cit not submitted',
  },
  accommodationTaxReturns: {
    id: `pdpp.application:application.errorModal.accommodationTaxReturns`,
    defaultMessage: 'Gisting skattframtal',
    description: 'Accomodations tax returns',
  },
  withholdingTaxReturns: {
    id: `pdpp.application:application.errorModal.withholdingTaxReturns`,
    defaultMessage: 'Staðgreiðsluskil',
    description: 'Witholding tax returns',
  },
  wageReturns: {
    id: `pdpp.application:application.errorModal.wageReturns`,
    defaultMessage: 'Laun skilar sér',
    description: 'Wage returns',
  },
})
