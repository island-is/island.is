import {
  YES,
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { PREPAID_INHERITANCE } from '../../lib/constants'

export const finalStep = buildSection({
  id: 'finalStep',
  title: m.readyToSubmit,
  children: [
    buildMultiField({
      id: 'finalStep',
      title: m.readyToSubmit,
      description: (application) =>
        application.answers.applicationFor === PREPAID_INHERITANCE
          ? m.beforeSubmitStatementPrePaid
          : m.beforeSubmitStatement,
      children: [
        buildCheckboxField({
          id: 'confirmAction',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.inheritanceReportSubmissionCheckbox,
            },
          ],
        }),
        buildSubmitField({
          id: 'inheritanceReport.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitReport,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
