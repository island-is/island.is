import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { overviewFields } from '../utils/overviewFields'
import { newPrimarySchoolMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'newPrimarySchoolInReview',
  children: [
    buildSection({
      id: 'review',
      tabTitle: newPrimarySchoolMessages.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'inReviewOverviewScreen',
          title: newPrimarySchoolMessages.overview.sectionTitle,
          children: [...overviewFields(false)],
        }),
      ],
    }),
  ],
})
