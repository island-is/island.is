import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: (application) =>
        application.state === 'approved'
          ? parentalLeaveFormMessages.reviewScreen.titleApproved
          : parentalLeaveFormMessages.reviewScreen.titleInReview,
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          title: (application) =>
            application.state === 'approved'
              ? parentalLeaveFormMessages.reviewScreen.titleApproved
              : parentalLeaveFormMessages.reviewScreen.titleInReview,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
