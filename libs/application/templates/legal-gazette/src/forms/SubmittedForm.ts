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
      id: 'submitted.section',
      children: [
        buildMultiField({
          id: 'submitted.success',
          title: m.submitted.success.formTitle,
          space: 3,
          children: [
            buildAlertMessageField({
              id: 'submitted.success.alert',
              title: m.submitted.success.applicationReceived,
              message: m.submitted.success.formIntro,
              alertType: 'success',
            }),
            buildCustomField({
              id: 'confirmation.preview',
              component: 'AdvertPreview',
            }),
          ],
        }),
      ],
    }),
  ],
})
