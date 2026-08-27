import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsluyfirlit',
      description: 'Title of payment section',
    },
  }),
  description: defineMessages({
    title: {
      id: 'pd.application:payment.description.title',
      defaultMessage: 'Greiða inn á skuld',
      description: 'Title of payment description field',
    },
    description: {
      id: 'pd.application:payment.description.description',
      defaultMessage:
        'Yfirlit þeirra skulda sem hægt er að greiða til ríkisins. Nánara yfirlit og sundurliðun skulda er undir Fjármál á Mínum Síðum.',
      description: 'Description of payment description field',
    },
  }),
  summary: defineMessages({
    forPaymentLabel: {
      id: 'pd.application:payment.summary.forPaymentLabel',
      defaultMessage: 'Til greiðslu',
      description: 'Heading shown above the list of selected debts',
    },
    totalLabel: {
      id: 'pd.application:payment.summary.totalLabel',
      defaultMessage: 'Samtals',
      description: 'Label for the total amount of selected debts',
    },
  }),
}
