import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { mm } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: 'Parental Leave',
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          title: (application) =>
            application.state === 'approved'
              ? mm.reviewScreen.titleApproved
              : mm.reviewScreen.titleInReview,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
