import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        buildCustomField({
          component: 'PaymentPending',
          id: 'paymentPendingField',
        }),
      ],
    }),
  ],
})
