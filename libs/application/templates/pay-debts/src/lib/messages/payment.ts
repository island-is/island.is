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
  }),
  summary: defineMessages({
    forPaymentLabel: {
      id: 'pd.application:payment.summary.forPaymentLabel',
      defaultMessage: 'Greiðsluliðir',
      description: 'Heading shown above the list of selected debts',
    },
    totalLabel: {
      id: 'pd.application:payment.summary.totalLabel',
      defaultMessage: 'Samtals til greiðslu',
      description:
        'Label for the total amount to be paid for the selected debts',
    },
    remainingLabel: {
      id: 'pd.application:payment.summary.remainingLabel',
      defaultMessage: 'Eftirstöðvar skuldar',
      description: 'Label for the remaining amount of the selected debts',
    },
  }),
  buttons: defineMessages({
    submit: {
      id: 'pd.application:overview.buttons.submit',
      defaultMessage: 'Greiða skuld',
      description: 'Submit application button',
    },
  }),
}
