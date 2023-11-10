import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'doneScreen',
      title: '',
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: 'todo',
          description: 'todo',
          children: [],
        }),
      ],
    }),
  ],
})
