import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const SubmittedFailed: Form = buildForm({
  id: 'SubmittedFailed',
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
      title: m.submitted.failed.sectionTitle,
      children: [
        buildMultiField({
          id: 'submitted.success',
          title: m.submitted.failed.formTitle,
          children: [
            buildAlertMessageField({
              id: 'submitted.success.alert',
              title: m.submitted.failed.alertTitle,
              message: m.submitted.failed.alertMessage,
              alertType: 'error',
            }),
            buildCustomField({
              id: 'submitted.success.reSubmit',
              component: 'ReSubmitField',
            }),
          ],
        }),
      ],
    }),
  ],
})
