import {
  buildForm,
  buildSection,
  buildMultiField,
  buildCustomField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const ApprovedForm: Form = buildForm({
  id: 'ApprovedForm',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'approved.section',
      title: m.approved.sectionTitle,
      children: [
        buildMultiField({
          id: 'approved.form',
          title: m.approved.formTitle,
          space: 5,
          children: [
            buildAlertMessageField({
              id: 'approved.description',
              title: m.approved.formSubtitle,
              message: m.approved.formIntro,
              alertType: 'success',
            }),
            buildCustomField({
              id: 'approved.createOrOverview',
              component: 'CreateOrOverview',
            }),
          ],
        }),
      ],
    }),
  ],
})
