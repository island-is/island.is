import * as m from '../lib/messages'
import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildPaymentPendingField,
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
        buildPaymentPendingField({
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
  ],
})
