import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'
import { getSignedAssigneeOverviewItems } from '../../../utils/assigneeUtil'

export const assigneeOverviewSection = buildSection({
  id: 'applicantSubmitAssigneeOverviewSection',
  tabTitle: asm.assigneeOverviewSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitAssigneeOverviewMultiField',
      title: asm.assigneeOverviewTitle,
      description: asm.assigneeOverviewDescription,
      children: [
        buildOverviewField({
          id: 'submitAssigneeInfoOverview',
          title: m.draftMessages.householdMembersSection.title,
          items: getSignedAssigneeOverviewItems,
        }),
        buildSubmitField({
          id: 'applicantSubmitFormSubmit',
          title: asm.submitButton,
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: asm.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
