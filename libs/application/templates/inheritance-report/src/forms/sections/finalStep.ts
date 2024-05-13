import {
  YES,
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const finalStep = buildSection({
  id: 'finalStep',
  title: m.readyToSubmit,
  children: [
    buildMultiField({
      id: 'finalStep',
      title: m.readyToSubmit,
      description: m.beforeSubmitStatement,
      children: [
        buildCheckboxField({
          id: 'confirmAction',
          title: '',
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
          title: '',
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
