import { defineMessages } from 'react-intl'

export const errorModal = defineMessages({
  maxDebtTitle: {
    id: `pdpp.application:application.errorModal.maxDebtTitle`,
    defaultMessage: 'Skuld yfir hámarki',
    description: 'Owes to much title',
  },
  maxDebtDescription: {
    id: `pdpp.application:application.errorModal.maxDebtDescription`,
    defaultMessage:
      'Ekki er hægt að gera greiðsluáætlun um þessa skuld með rafrænum hætti þar sem hún er hærri en {maxDebtAmount} Vinsamlegast hafðu samband við innheimtumann í þínu umdæmi.',
    description: 'Owes to much description',
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
  closeModal: {
    id: `pdpp.application:application.errorModal.closeModal`,
    defaultMessage: 'Loka umsókn',
    description: 'Close modal button',
  },
  moreInformation: {
    id: `pdpp.application:application.errorModal.moreInformation`,
    defaultMessage: 'Frekari upplýsingar',
    description: 'More information button',
  },
})
