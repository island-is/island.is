import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const payment: Form = buildForm({
  id: 'OperatingLicensetApplicationPaymentForm',
  title: '',
  mode: FormModes.DRAFT,
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
