import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'

export const otherApprovalSection = buildSection({
  id: 'assigneePrereqSection',
  title: m.assigneeApproval.prereqMunicipalitySectionTitle,
  children: [
    buildMultiField({
      id: 'assigneePrereqMultiField',
      title: m.assigneeApproval.prereqMunicipalitySectionTitle,
      description: m.assigneeApproval.prereqMunicipalityDescription,
      children: [
        buildCheckboxField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'confirmMunicipalityDataFetch',
            ),
          options: [
            {
              label: m.assigneeApproval.prereqConfirmRead,
              value: YES,
            },
          ],
          required: true,
        }),
      ],
    }),
  ],
})
