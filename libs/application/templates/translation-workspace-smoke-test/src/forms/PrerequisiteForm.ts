import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildTitleField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const PrerequisiteForm: Form = buildForm({
  id: 'TranslationWorkspaceSmokeTestPrerequisiteForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisiteSection',
      title: m.prerequisiteSectionTitle,
      children: [
        buildMultiField({
          id: 'prerequisiteMultiField',
          title: m.prerequisiteSectionTitle,
          children: [
            buildTitleField({
              title: m.prerequisiteFieldTitle,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'prerequisiteDescription',
              description: m.prerequisiteFieldDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
