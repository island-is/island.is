import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { buildContractOverviewFields } from '../draftForm/overviewSection/contractOverviewFields'
import * as m from '../../lib/messages'

export const AssigneeReviewSection = buildSection({
  id: 'assigneeReview',
  title: m.inReview.assigneeInfo.sectionName,
  children: [
    buildMultiField({
      id: 'assigneeReview',
      title: m.inReview.assigneeInfo.pageTitle,
      description: m.inReview.assigneeInfo.pageDescription,
      children: [
        buildDescriptionField({
          id: 'assigneeReview.info',
          title: m.inReview.assigneeInfo.infoHeading,
          description: m.inReview.assigneeInfo.infoBullets,
          titleVariant: 'h3',
          marginTop: 3,
          marginBottom: 6,
        }),
        ...buildContractOverviewFields({ editable: false }),
      ],
    }),
  ],
})
