import {
  buildForm,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const MainForm: Form = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'main',
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'Description',
          description: 'This is a description',
        }),
      ],
    }),
  ],
})
