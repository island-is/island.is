import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import { m } from '../lib/messages'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        buildCustomField({
          component: 'PaymentPending',
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
  ],
})
