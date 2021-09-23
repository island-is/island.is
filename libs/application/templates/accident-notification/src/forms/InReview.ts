import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { inReview } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'InReviewSteps.one',
          title: inReview.general.title,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
