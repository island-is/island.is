import {
  buildForm,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const DraftForm: Form = buildForm({
  id: 'DraftDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'draft_section',
      title: m.requirements.legalEntity.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'toPublishing',
          title: m.requirements.legalEntity.formTitle,
        }),
      ],
    }),
  ],
})
