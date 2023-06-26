import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Payment: Form = buildForm({
  id: 'MortgageCertificateApplicationPaymentForm',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [
        buildCustomField({
          id: 'paymentPendingField',
          component: 'PaymentPendingField',
          title: m.confirmation,
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
