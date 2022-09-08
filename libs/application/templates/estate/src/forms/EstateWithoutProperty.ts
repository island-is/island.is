import { buildDescriptionField, buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const estateWithoutProperty: Form = buildForm({
  id: 'estateWithoutProperty',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'estateWithoutProperty',
      title: 'Meow meow',
      description: 'lalallalalall lalallaa llllaaalaa looo',
    }),
  ],
})
