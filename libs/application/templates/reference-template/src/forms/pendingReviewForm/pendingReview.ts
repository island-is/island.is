import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  title: 'Í vinnslu',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildDescriptionField({
      id: 'inReview',
      title: 'In review',
      description: 'Your application is now in review. ',
    }),
  ],
})
