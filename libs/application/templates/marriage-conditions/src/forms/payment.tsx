import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

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
