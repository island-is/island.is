import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'done',
      title: 'Til hamingju!',
      description: 'Umsókn þín hefur verið samþykkt!',
    }),
  ],
})
