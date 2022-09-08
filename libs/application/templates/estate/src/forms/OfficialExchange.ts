import { buildDescriptionField, buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const officialExchange: Form = buildForm({
  id: 'officialExchange',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'officialExchange',
      title: 'Hola amiga',
      description: 'Muy bonita!',
    }),
  ],
})
