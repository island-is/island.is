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
      title: m.requirements.institution.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'draft_title',
          title: m.requirements.institution.formTitle,
        }),
      ],
    }),
  ],
})
