import * as m from '../lib/messages'
import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'ExamplePaymentPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: m.draft.externalDataTitle,
      children: [],
    }),
    buildSection({
      id: 'info',
      title: m.draft.informationTitle,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: m.m.paymentConfirmation,
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
      title: m.step.confirmTitle,
      children: [],
    }),
  ],
})
