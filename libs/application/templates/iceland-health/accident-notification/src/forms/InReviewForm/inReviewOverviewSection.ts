import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { overviewFields } from '../../utils/overviewFields'

export const inReviewOverviewSection = (isAssignee?: boolean) =>
  buildSection({
    id: 'InReviewOverviewSection',
    title: overview.general.sectionTitle,
    children: [
      buildMultiField({
        id: 'inReviewOverviewScreen',
        title: 'Yfirlit',
        children: [
          ...overviewFields(isAssignee),
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
      }),
    ],
  })
