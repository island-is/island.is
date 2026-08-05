import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import { isHouseholdMemberApproved } from '../../../utils/conditions'

export const otherApprovalSection = buildSection({
  condition: isHouseholdMemberApproved,
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
        }),
      ],
    }),
  ],
})
