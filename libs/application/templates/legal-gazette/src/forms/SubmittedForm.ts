import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const SubmittedForm: Form = buildForm({
  id: 'SubmittedForm',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'prequisites.section',
      children: [],
    }),
    buildSection({
      id: 'draft.section',
      children: [],
    }),
    buildSection({
      id: 'publishing.section',
      children: [],
    }),
    buildSection({
      id: 'submitted.section',
      children: [
        buildMultiField({
          id: 'submitted.success',
          title: m.submitted.success.formTitle,
          description: m.submitted.success.formTitle,
          children: [],
        }),
      ],
    }),
  ],
})
