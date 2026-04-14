import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'

export const otherApprovalSection = buildSection({
  id: 'assigneePrereqSection',
  title: m.assigneeApproval.prereqSectionTitle,
  children: [
    buildMultiField({
      id: 'assigneePrereqMultiField',
      title: m.assigneeApproval.prereqSectionTitle,
      description: m.assigneeApproval.prereqDescription,
      children: [
        buildDescriptionField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneePrereqIntro'),
          description: m.assigneeApproval.prereqDescription,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'confirmRead'),
          options: [
            {
              label: m.assigneeApproval.prereqConfirmRead,
              value: YES,
            },
          ],
          marginBottom: 4,
          required: true,
        }),
      ],
    }),
  ],
})
