import { buildCustomField, buildSection } from '@island.is/application/core'
import { overview } from '../../lib/messages'

export const inReviewOverviewSection = (isAssignee?: boolean) =>
  buildSection({
    id: 'InReviewOverviewSection',
    title: overview.general.sectionTitle,
    children: [
      buildCustomField(
        {
          id: 'inReviewOverviewScreen',
          title: '',
          component: 'FormOverviewInReview',
        },
        {
          isAssignee,
        },
      ),
    ],
  })
