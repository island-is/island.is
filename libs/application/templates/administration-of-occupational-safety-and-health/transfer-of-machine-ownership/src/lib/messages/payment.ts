import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosah.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'aosah.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'aosah.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'aosah.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
    alertTitle: {
      id: 'aosah.application:payment.paymentChargeOverview.alertTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Alert title',
    },
    alertMessage: {
      id: 'aosah.application:payment.paymentChargeOverview.alertMessage',
      defaultMessage:
        'Ef ekki verður komið samþykki frá nýjum eiganda innan 7 daga verður greiðslan endurgreidd og salan gerð óvirk.',
      description: 'Alert message',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'aosah.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
