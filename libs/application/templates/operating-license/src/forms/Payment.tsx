import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const payment: Form = buildForm({
  id: 'OperatingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.payment,
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
