import {
  buildAlertMessageField,
  buildCustomField,
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
      id: 'submitted.section',
      children: [
        buildMultiField({
          id: 'submitted.success',
          title: m.submitted.success.formTitle,
          children: [
            buildAlertMessageField({
              id: 'submitted.success.alert',
              title: m.submitted.success.applicationReceived,
              message: m.submitted.success.formIntro,
              alertType: 'success',
            }),
            buildCustomField({
              id: 'submitted.confirmation',
              component: 'Confirmation',
            }),
          ],
        }),
      ],
    }),
  ],
})
