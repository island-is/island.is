import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { overviewFields } from '../utils/overviewFields'
import { overviewMessages } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'newPrimarySchoolInReview',
  children: [
    buildSection({
      id: 'review',
      tabTitle: overviewMessages.sectionTitle,
      children: [
        buildMultiField({
          id: 'inReviewOverviewScreen',
          title: overviewMessages.sectionTitle,
          children: [...overviewFields(false)],
        }),
      ],
    }),
  ],
})
