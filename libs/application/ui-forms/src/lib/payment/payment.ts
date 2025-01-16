import * as m from './messages'
import {
  buildForm,
  buildSection,
  buildPaymentPendingField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const PaymentForm: Form = buildForm({
  id: 'ExamplePaymentPaymentForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'info',
      title: m.messages.informationTitle,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: m.messages.paymentConfirmation,
      children: [
        buildPaymentPendingField({
          id: 'paymentPending',
          title: m.messages.paymentConfirmation,
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: m.messages.confirmTitle,
      children: [],
    }),
  ],
})
