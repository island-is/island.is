import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { mm } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  name: 'Parental Leave',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      name: '',
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          name: (application) =>
            application.state === 'approved'
              ? mm.reviewScreen.titleApproved
              : mm.reviewScreen.titleInReview,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
