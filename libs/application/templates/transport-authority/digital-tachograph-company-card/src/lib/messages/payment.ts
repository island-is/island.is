import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtcc.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.dtcc.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
    tryAgain: {
      id: 'ta.dtcc.application:payment.general.tryAgain',
      defaultMessage: 'Reyna aftur',
      description: '',
    },
    forwardingToPayment: {
      id: 'ta.dtcc.application:payment.general.forwardingToPayment',
      defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
      description: 'Forwarding you to payment handler...',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'ta.dtcc.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.dtcc.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
  paymentPending: defineMessages({
    examplePaymentPendingFieldError: {
      id: 'ta.dtcc.application:example.waitingForPaymentError',
      defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
      description: 'An error came up while getting payment information',
    },
    submitErrorTitle: {
      id: 'ta.dtcc.application:submitErrorTitle',
      defaultMessage: 'Móttaka umsóknar tókst ekki',
      description:
        'title that shows up when an error occurs while submitting the application',
    },
    submitErrorMessage: {
      id: 'ta.dtcc.application:submitErrorMessage',
      defaultMessage:
        'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
      description:
        'Text that shows up when an error occurs while submitting the application',
    },
    submitErrorButtonCaption: {
      id: 'ta.dtcc.application:submitErrorButtonCaption',
      defaultMessage: 'Reyna aftur',
      description:
        'Button that shows up when submitting the application fails, allowing you to retry',
    },
    paymentPendingDescription: {
      id: 'ta.dtcc.application:paymentPendingDescription',
      defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
      description: 'Please wait until the payment is confirmed',
    },
  }),
  paymentUrlNotFound: defineMessages({
    examplePaymentPendingFieldError: {
      id: 'ta.dtcc.application:example.waitingForPaymentError',
      defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
      description: 'An error came up while getting payment information',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'ta.dtcc.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
