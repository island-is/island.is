import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.tvo.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.tvo.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
    tryAgain: {
      id: 'ta.tvo.application:payment.general.tryAgain',
      defaultMessage: 'Reyna aftur',
      description: '',
    },
    forwardingToPayment: {
      id: 'ta.tvo.application:payment.general.forwardingToPayment',
      defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
      description: 'Forwarding you to payment handler...',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'ta.tvo.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.tvo.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
    alertTitle: {
      id: 'ta.tvo.application:payment.paymentChargeOverview.alertTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Alert title',
    },
    alertMessage: {
      id: 'ta.tvo.application:payment.paymentChargeOverview.alertMessage',
      defaultMessage:
        'Ef ekki verður komið samþykki frá nýjum eiganda innan 7 daga verður greiðslan endurgreidd og salan gerð óvirk.',
      description: 'Alert message',
    },
  }),
  paymentPending: defineMessages({
    examplePaymentPendingFieldError: {
      id:
        'ta.tvo.application:payment.paymentPending.examplePaymentPendingFieldError',
      defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
      description: 'An error came up while getting payment information',
    },
    submitErrorTitle: {
      id: 'ta.tvo.application:payment.paymentPending.submitErrorTitle',
      defaultMessage: 'Móttaka umsóknar tókst ekki',
      description:
        'title that shows up when an error occurs while submitting the application',
    },
    submitErrorMessage: {
      id: 'ta.tvo.application:payment.paymentPending.submitErrorMessage',
      defaultMessage:
        'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
      description:
        'Text that shows up when an error occurs while submitting the application',
    },
    submitErrorButtonCaption: {
      id: 'ta.tvo.application:payment.paymentPending.submitErrorButtonCaption',
      defaultMessage: 'Reyna aftur',
      description:
        'Button that shows up when submitting the application fails, allowing you to retry',
    },
    paymentPendingDescription: {
      id: 'ta.tvo.application:payment.paymentPending.paymentPendingDescription',
      defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
      description: 'Please wait until the payment is confirmed',
    },
  }),
  paymentUrlNotFound: defineMessages({
    examplePaymentPendingFieldError: {
      id:
        'ta.tvo.application:payment.paymentUrlNotFound.examplePaymentPendingFieldError',
      defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
      description: 'An error came up while getting payment information',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'ta.tvo.application:payment.confirmation.confirm',
      defaultMessage: 'Staðfesta',
      description: 'Confirm button',
    },
  }),
}
