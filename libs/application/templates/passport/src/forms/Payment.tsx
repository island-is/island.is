import { m } from '../lib/messages'
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
      title: m.payment,
      children: [
        buildCustomField({
          component: 'PaymentPendingScreen',
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
  ],
})
