import { defineMessages } from 'react-intl'

export const paymentInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:paymentInformation.general.sectionTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information section title',
    },
    pageTitle: {
      id: 'aa.application:paymentInformation.general.pageTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: `Payment information page title`,
    },
  }),
  labels: defineMessages({
    accountInformation: {
      id: 'aa.application:paymentInformation.labels.accountInformation',
      defaultMessage: 'Reikningsupplýsingar',
      description: 'Account information label',
    },
  }),
}
