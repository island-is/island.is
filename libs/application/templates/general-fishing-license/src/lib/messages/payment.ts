import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:payment.general.sectionTitle',
      defaultMessage: 'Staðfesting á greiðslu',
      description: 'Payment',
    },
  }),
  labels: defineMessages({
    forwardingToPayment: {
      id: 'gfl.application:payment.labels.forwardingToPayment',
      defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
      description: 'Forwarding you to payment handler...',
    },
    submitErrorTitle: {
      id: 'gfl.application:payment.labels.submitErrorTitle',
      defaultMessage: 'Móttaka umsóknar tókst ekki',
      description:
        'title that shows up when an error occurs while submitting the application',
    },
    submitErrorMessage: {
      id: 'gfl.application:payment.labels.submitErrorMessage',
      defaultMessage:
        'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
      description:
        'Text that shows up when an error occurs while submitting the application',
    },
    submitErrorButtonCaption: {
      id: 'gfl.application:payment.labels.submitErrorButtonCaption',
      defaultMessage: 'Reyna aftur',
      description:
        'Button that shows up when submitting the application fails, allowing you to retry',
    },
    paymentPendingFieldError: {
      id: 'gfl.application:payment.labels.paymentPendingFieldError',
      defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
      description: 'An error came up while getting payment information',
    },
    paymentPendingDescription: {
      id: 'gfl.application:payment.labels.paymentPendingDescription',
      defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
      description: 'Please wait until the payment is confirmed',
    },
    paymentImage: {
      id: 'gfl.application:payment.labels.paymentImage',
      defaultMessage: `Skrautmynd`,
      description: 'Company Image',
    },
  }),
}
