import {
  buildForm,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const PaymentPending: Form = buildForm({
  id: 'PaymentPending',
  title: m.paymentPendingConfirmation,
  mode: FormModes.PENDING,
  children: [
    buildCustomField({
      component: '../fields/ExamplePaymentPendingField',
      id: 'paymentPendingField',
      title: '',
    }),
  ],
})
