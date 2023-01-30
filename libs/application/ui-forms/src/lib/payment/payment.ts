import * as m from './messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const paymentForm: Form = buildForm({
  id: 'ExamplePaymentPaymentForm',
  title: '',
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
        buildCustomField({
          component: 'PaymentPendingScreen',
          id: 'paymentPendingField',
          title: '',
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
