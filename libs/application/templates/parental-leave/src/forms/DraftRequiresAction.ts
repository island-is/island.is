import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const DraftRequiresAction: Form = buildForm({
  id: 'ParentalLeaveSubmissionNeedsAction',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        // buildCustomField({
        //   id: 'InReviewSteps',
        //   title: (application) =>
        //     application.state === 'approved'
        //       ? parentalLeaveFormMessages.reviewScreen.titleApproved
        //       : parentalLeaveFormMessages.reviewScreen.titleInReview,
        //   component: 'InReviewSteps',
        // }),
        buildDescriptionField({
          id: 'intro',
          title: '',
          description: {
            id: 'pl.application:form.editsNeedsAction.title',
            defaultMessage:
              'Your submission was not approved, please edit the application and re-submit.',
            description:
              'Your submission was not approved, please edit the application and re-submit.',
          },
        }),
      ],
    }),
  ],
})
