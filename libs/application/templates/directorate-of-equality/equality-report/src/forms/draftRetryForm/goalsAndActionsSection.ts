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
// (goalsAndActions.filename) so this edits the same underlying answer
// rather than a shadow copy.
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
          iconProps: { icon: 'open', type: 'outline' },
        }),
        // Between the screen's own intro and the editor: the comments are what
        // the applicant is here to act on, so they come before the thing they
        // edit. Unconditional with an empty state rather than gated on stale
        // externalData — the field refetches the thread itself on mount.
        buildCustomField(
          {
            id: 'commentThread',
            title: '',
            component: 'CommentThread',
          },
          { showEmptyState: true },
        ),
        buildCustomField(
          {
            id: 'goalsAndActions.filename',
            component: 'Editor',
          },
          { mode: 'retry' },
        ),
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
