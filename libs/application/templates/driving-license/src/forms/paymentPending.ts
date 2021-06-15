import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'

export const PaymentPending: Form = buildForm({
  id: 'PaymentPending',
  title: m.paymentPendingConfirmation,
  mode: FormModes.PENDING,
  children: [
    buildCustomField({
      component: 'ExamplePaymentPendingField',
      id: 'paymentPendingField',
      title: '',
    }),
  ],
})
