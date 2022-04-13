import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'

export const getPayment = (): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationPaymentForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: false,
    children: [
      buildSection({
        id: 'awaitingPayment',
        title: 'test',
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
