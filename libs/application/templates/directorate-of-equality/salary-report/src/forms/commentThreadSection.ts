import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../lib/messages'

// Sections for IN_REVIEW/POSTPONED (where a message can be sent) always
// render — the field itself decides whether to show the send box. Sections
// for other states (DRAFT/APPROVED/DENIED) only render once a conversation
// already exists, since a fresh draft can't have any comments yet.
export const buildCommentThreadSection = ({
  alwaysShow = false,
}: { alwaysShow?: boolean } = {}) =>
  buildSection({
    id: 'commentThread',
    title: messages.comments.sectionTitle,
    tabTitle: messages.comments.sectionTitle,
    condition: alwaysShow
      ? undefined
      : (_, externalData) =>
          (
            (getValueViaPath(
              externalData,
              'getReportComments.data',
            ) as unknown[]) ?? []
          ).length > 0,
    children: [
      buildMultiField({
        id: 'commentThreadMultiField',
        title: messages.comments.sectionTitle,
        children: [
          buildCustomField({
            id: 'commentThread',
            title: '',
            component: 'CommentThread',
          }),
        ],
      }),
    ],
  })
