import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildTitleField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const DraftForm: Form = buildForm({
  id: 'TranslationWorkspaceSmokeTestDraftForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'draftSection',
      title: m.draftSectionTitle,
      children: [
        buildMultiField({
          id: 'draftMultiField',
          title: m.draftSectionTitle,
          children: [
            buildTitleField({
              title: m.draftFieldTitle,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'draftDescription',
              description: m.draftFieldDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
