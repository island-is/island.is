import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'ep.application:applicationTitle',
    defaultMessage: 'Umsókn um greiðslu',
    description: 'Title of the application',
  },
  doneTitle: {
    id: 'ep.application:doneTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application was received',
  },
  institution: {
    id: 'ep.application:institution',
    defaultMessage: 'Fjársýslan',
    description: 'Institution responsible',
  },
  payUp: {
    id: 'ep.application:payUp',
    defaultMessage: 'Greiða',
    description: 'Label for payment button',
  },
  forPaymentLabel: {
    id: 'ep.application:forPaymentLabel',
    defaultMessage: 'Til greiðslu',
    description: 'title for payment overview component',
  },
  totalLabel: {
    id: 'ep.application:totalLabel',
    defaultMessage: 'Samtals til greiðslu',
    description: 'total label for payment overview component',
  },
  feeProviderError: {
    id: 'ep.application:feeProviderError',
    defaultMessage: 'Villa kom upp við að sækja verðskrá hjá Fjársýslunni',
    description: 'Error came up',
  },
  paymentConfirmation: {
    id: 'ep.application:paymentConfirmation',
    defaultMessage: 'Staðfesting á greiðslu',
    description: 'Title of the application',
  },
})

export const draft = defineMessages({
  externalDataTitle: {
    id: 'ep.application:draft.externalDataTitle',
    defaultMessage: 'Gögn sem sótt verða',
    description: 'Title for fetching data',
  },
  feeInfo: {
    id: 'ep.application:draft.feeInfo',
    defaultMessage: 'Upplýsingar um verð og kostnað hjá Fjársýslunni',
    description: 'Title for fetching data',
  },
  informationTitle: {
    id: 'ep.application:draft.informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'info',
  },
  paymentOverviewTitle: {
    id: 'ep.application:draft.paymentOverviewTitle',
    defaultMessage: 'Greiðsluyfirlit',
    description: 'payment overview title',
  },
  selectFieldTitle: {
    id: 'ep.application:draft.selectFieldTitle',
    defaultMessage: 'Veldu gjaldalið',
    description: 'Title for picking a price',
  },
})

export const step = defineMessages({
  externalDataTitle: {
    id: 'ep.application:step.externalData',
    defaultMessage: 'Forsendur',
    description: 'Title for payment external data section',
  },
  info: {
    id: 'ep.application:step.info',
    defaultMessage: 'Umsókn',
    description: 'Title for application section',
  },
  paymentTitle: {
    id: 'ep.application:step.paymentTitle',
    defaultMessage: 'Greiðsla',
    description: 'Title for payment step',
  },
  confirmTitle: {
    id: 'ep.application:step.confirmTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title for confirm step',
  },
})
