import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'

export const PaymentPending: Form = buildForm({
  id: 'PaymentPending',
  title: 'Beðið eftir staðfestingu greiðsluveitu',
  mode: FormModes.PENDING,
  children: [
    buildCustomField({
      component: 'ExamplePaymentPendingField',
      id: 'paymentPendingField',
      title: '',
    }),
  ],
})
