import {
  buildForm,
  buildSection,
  buildMultiField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

// Read-only status screen for assignees while the application is back with
// the applicant (in draft after a rejection/edit, or in payment). Assignees
// keep visibility of the application in these states but have no actions, so
// this form only informs them of the current status. Without a form for the
// ASSIGNEE role the form shell never resolves a form and renders an infinite
// loader.
export const assigneeStatusForm: Form = buildForm({
  id: 'assigneeStatusForm',
  title: m.inReviewGeneralTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'assigneeStatus',
      title: m.assigneeStatusTitle,
      children: [
        buildMultiField({
          id: 'assigneeStatus.info',
          title: m.assigneeStatusTitle,
          children: [
            buildAlertMessageField({
              id: 'assigneeStatus.alert',
              title: m.assigneeStatusTitle,
              message: m.assigneeStatusDescription,
              alertType: 'info',
              marginTop: 3,
            }),
          ],
        }),
      ],
    }),
  ],
})
