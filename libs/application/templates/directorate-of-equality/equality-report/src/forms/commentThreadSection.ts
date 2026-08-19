import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import type { ApplicationReportCommentDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../lib/messages'

export const hasReviewerComment = (
  _answers: FormValue,
  externalData: ExternalData,
) =>
  (
    (getValueViaPath(
      externalData,
      'getReportComments.data',
    ) as ApplicationReportCommentDto[]) ?? []
  ).some((comment) => comment.authorKind === 'REVIEWER')

// By default, the section only renders once DMR has actually left a comment —
// the applicant must never be able to be the one who starts the
// conversation. Note: externalData.getReportComments is only as fresh as the
// last onEntry (state transition) or on-demand fetch, so if DMR posts its
// first comment while the applicant is sitting on IN_REVIEW without a
// further transition, this section may stay hidden until the next
// transition refreshes it — a known, accepted tradeoff.
//
// alwaysVisible skips that condition (used for IN_REVIEW, the state where
// DMR's first message actually lands and the staleness risk above matters
// most) and instead shows a friendly "no messages yet" placeholder — same
// pattern official-journal-of-iceland's Comments field uses — rather than
// hiding the whole tab and risking it never reappearing.
export const buildCommentThreadSection = ({
  alwaysVisible = false,
}: { alwaysVisible?: boolean } = {}) =>
  buildSection({
    id: 'commentThread',
    title: messages.comments.sectionTitle,
    tabTitle: messages.comments.sectionTitle,
    condition: alwaysVisible ? undefined : hasReviewerComment,
    children: [
      buildMultiField({
        id: 'commentThreadMultiField',
        title: messages.comments.sectionTitle,
        children: [
          buildCustomField(
            {
              id: 'commentThread',
              title: '',
              component: 'CommentThread',
            },
            alwaysVisible ? { showEmptyState: true } : undefined,
          ),
        ],
      }),
    ],
  })
