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
          // TODO: Can we make the name conditional?
          // ex: name: state==='approved' ? "Your application is approved" : "Your application is in review"
          name: mm.reviewScreen.titleInReview,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
