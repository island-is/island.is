import {
  buildForm,
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const ApprovedForm: Form = buildForm({
  id: 'ApprovedForm',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      title: m.requirements.approval.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'draft.section',
      title: m.draft.sections.advert.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'publishing',
      title: m.draft.sections.publishing.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'preview',
      title: m.draft.sections.preview.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.draft.sections.confirmation.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'approved.section',
      title: m.approved.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'approved.description',
          description: m.approved.formIntro,
        }),
      ],
    }),
  ],
})
