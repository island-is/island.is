import { defineMessages } from 'react-intl'

export const paymentChargeOverview = {
  information: defineMessages({
    sectionTitle: {
      id: 'uiForms.application:paymentChargeOverview.information.sectionTitle',
      defaultMessage: 'Greiðsla',
      description:
        'The title of the form payment charge overview section for all applications (in sidebar)',
    },
    formTitle: {
      id: 'uiForms.application:paymentChargeOverview.information.formTitle',
      defaultMessage: 'Greiðsla',
      description:
        'The title of the form conclusion section for all applications (in the form it self)',
    },
    continueButton: {
      id: 'uiForms.application:paymentChargeOverview.information.continueButton',
      defaultMessage: 'Áfram',
      description: 'Continue button text',
    },
  }),
  payment: defineMessages({
    forPayment: {
      id: 'uiForms.application:paymentChargeOverview.payment.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'uiForms.application:paymentChargeOverview.payment.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
}
