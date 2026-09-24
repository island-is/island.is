import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const CompletedForm: Form = buildForm({
  id: 'TranslationWorkspaceSmokeTestCompletedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'completedSection',
      title: m.completedTitle,
      children: [
        buildMultiField({
          id: 'completedMultiField',
          title: m.completedTitle,
          children: [
            buildDescriptionField({
              id: 'completedDescription',
              title: m.completedTitle,
              description: m.prerequisiteFieldDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
