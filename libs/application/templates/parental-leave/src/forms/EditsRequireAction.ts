import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  Form,
  FormModes,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const EditsRequireAction: Form = buildForm({
  id: 'ParentalLeaveEditsNeedAction',
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
        // buildDescriptionField({
        //   id: 'intro',
        //   title: '',
        //   description: {
        //     id: 'pl.application:form.editsNeedsAction.title',
        //     defaultMessage:
        //       'Your edits were not approved, you can choose to modify them and resubmit or discard the modifications.',
        //     description:
        //       'Your edits were not approved, you can choose to modify them and resubmit or discard the modifications.',
        //   },
        // }),

        buildMultiField({
          id: 'multi',
          title: {
            id: 'pl.application:form.editsNeedsAction.title',
            defaultMessage: 'Edits not approved',
            description: 'Edits not approved',
          },
          children: [
            buildDescriptionField({
              id: 'intro',
              title: '',
              description: {
                id: 'pl.application:form.editsNeedsAction.title',
                defaultMessage:
                  'Your edits were not approved, you can choose to modify them and resubmit or discard the modifications.',
                description:
                  'Your edits were not approved, you can choose to modify them and resubmit or discard the modifications.',
              },
            }),
            buildSubmitField({
              id: 'submit',
              title: {
                id: 'pl.application:form.editsNeedsAction.submitField',
                defaultMessage: '',
                description: '',
              },
              placement: 'screen',
              actions: [
                { name: 'Cancel Edits', type: 'cancel', event: 'ABORT' },
                { name: 'Edit', type: 'primary', event: 'EDIT' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
