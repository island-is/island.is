import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { getSignedAssigneeOverviewItems } from '../../../utils/assigneeUtil'

export const assigneeOverviewSection = buildSection({
  id: 'applicantSubmitAssigneeOverviewSection',
  title: m.applicantSubmitMessages.assigneeOverviewSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitAssigneeOverviewMultiField',
      title: m.applicantSubmitMessages.assigneeOverviewTitle,
      description: m.applicantSubmitMessages.assigneeOverviewDescription,
      children: [
        buildOverviewField({
          id: 'submitAssigneeInfoOverview',
          title: m.draftMessages.householdMembersSection.title,
          items: getSignedAssigneeOverviewItems,
        }),
        buildSubmitField({
          id: 'applicantSubmitFormSubmit',
          title: m.applicantSubmitMessages.submitButton,
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.applicantSubmitMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
