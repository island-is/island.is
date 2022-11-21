import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const getPayment = (): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationPaymentForm',
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
}
