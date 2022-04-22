import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  title: 'Í vinnslu',
  mode: FormModes.PENDING,
  children: [
    buildDescriptionField({
      id: 'inReview',
      title: 'Í vinnslu',
      description: 'Umsókn þín um ökunám er nú í vinnslu. ',
    }),
  ],
})
