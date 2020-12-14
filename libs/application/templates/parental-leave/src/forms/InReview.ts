import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  name: 'Parental Leave',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      name: 'In Review',
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          name: 'Your application is in review',
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
