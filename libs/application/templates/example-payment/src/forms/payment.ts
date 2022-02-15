import * as m from '../lib/messages'
import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.m.paymentConfirmation,
      children: [
        buildCustomField(
          {
            component: 'PaymentPending',
            id: 'paymentPendingField',
            title: '',
          },
          {
            errorMessages: {
              submitTitle: m.paymentScreen.submitTitle,
              submitMessage: m.paymentScreen.submitMessage,
              submitRetryButtonCaption:
                m.paymentScreen.submitRetryButtonCaption,
              statusTitle: m.paymentScreen.statusTitle,
            },
            messages: {
              pollingTitle: m.paymentScreen.pollingMessage,
            },
          },
        ),
      ],
    }),
  ],
})
