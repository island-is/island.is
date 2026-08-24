import {
  buildCustomField,
  buildLinkField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { messages } from '../../lib/messages'

// Reuses the same field id as mainForm's equalityReportSection
// (goalsAndActions.customField) so this edits the same underlying answer
// rather than a shadow copy. No inline CommentThread here — draftRetryForm
// already has its own standalone comments screen as the landing page.
export const draftRetryGoalsAndActionsSection = buildSection({
  id: 'draftRetryGoalsAndActions',
  title: messages.equalityReport.goalsAndActions.sectionTitle,
  children: [
    buildMultiField({
      id: 'draftRetryGoalsAndActionsMultiField',
      title: messages.equalityReport.goalsAndActions.title,
      description: messages.equalityReport.goalsAndActions.intro,
      children: [
        buildLinkField({
          id: 'draftRetryGoalsAndActions.link',
          title: messages.equalityReport.information.detailLinkLabel,
          link: messages.equalityReport.information.detailLink,
          variant: 'text',
        }),
        buildCustomField({
          id: 'goalsAndActions.customField',
          component: 'Editor',
        }),
        buildSubmitField({
          id: 'draftRetrySubmit',
          title: messages.draftRetry.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: messages.draftRetry.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
