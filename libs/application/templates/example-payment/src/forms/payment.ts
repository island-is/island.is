import * as m from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const payment: Form = buildForm({
  id: 'ExamplePaymentPaymentForm',
  title: '',
  mode: FormModes.DRAFT,
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
