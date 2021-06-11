import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const PaymentPending: Form = buildForm({
  id: 'PaymentPending',
  title: 'Beðið eftir staðfestingu greiðsluveitu',
  mode: FormModes.PENDING,
  children: [
    buildDescriptionField({
      id: 'inReview',
      title: 'Beðið eftir staðfó',
      description: 'Bíðum eftir staðfó',
    }),
  ],
})
