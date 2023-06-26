import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Rejected: Form = buildForm({
  id: 'ExampleRejected',
  title: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      title: 'Því miður...',
      description: 'Umsókn þinni verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
