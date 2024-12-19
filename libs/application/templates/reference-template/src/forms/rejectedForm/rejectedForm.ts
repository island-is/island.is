import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Rejected: Form = buildForm({
  id: 'ExampleRejected',
  title: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      title: 'Sorry...',
      description: 'Your application has been rejected! It is pretty sad.',
    }),
  ],
})
