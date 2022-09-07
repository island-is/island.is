import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'approved',
      title: 'Til hamingju!',
      description: 'Umsókn þín hefur verið samþykkt!',
    }),
  ],
})
