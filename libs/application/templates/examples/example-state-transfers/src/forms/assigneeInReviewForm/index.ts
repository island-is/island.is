import {
  buildAlertMessageField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { isApproved, isRejected } from '../../utils/conditions'

export const AssigneeInReviewForm = buildForm({
  id: 'AssigneeInReviewForm',
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'assigneeInReview',
      tabTitle: 'In Review',
      children: [
        buildMultiField({
          id: 'assigneeInReviewMultiField',
          title: 'Assignee Info',
          children: [
            buildDescriptionField({
              id: 'assigneeInReview',
              description: 'This application is now in the IN_REVIEW state.',
            }),
            buildDescriptionField({
              id: 'assigneeInReview2',
              description:
                'You are now viewing this application as the assignee that is going to review and choose to approve or reject.',
            }),
            buildDescriptionField({
              id: 'assigneeInReview3',
              description:
                'Here you can include an overview of the application to aid with the decision making process.',
            }),
            buildDescriptionField({
              id: 'assigneeInReview4',
              description:
                'A common requirement is to have a reason for rejection that we can show the user when they reccives the rejection.',
            }),

            buildRadioField({
              id: 'approveOrReject',
              options: [
                {
                  label: 'Move the application to the APPROVED state',
                  value: 'approve',
                },
                {
                  label: 'Move the application to the REJECTED state',
                  value: 'reject',
                },
              ],
            }),
            buildDescriptionField({
              condition: isRejected,
              id: 'approveOrRejectDescription',
              title: 'You are about to reject the application',
              titleVariant: 'h4',
              description: 'Please provide a reason for rejection.',
            }),
            buildTextField({
              condition: isRejected,
              id: 'approveOrRejectReason',
              title: 'Rejection reason',
              placeholder: 'Please enter a reason for approval or rejection',
              rows: 5,
              maxLength: 1000,
              variant: 'textarea',
            }),
            buildAlertMessageField({
              condition: isRejected,
              id: 'approveOrRejectAlert',
              alertType: 'warning',
              title: 'Warning',
              message: 'Note that this is an irreversible action.',
            }),

            // Use condition to show the correct submit button
            buildSubmitField({
              condition: isApproved,
              id: 'approveApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [{ event: 'APPROVE', name: 'Approve', type: 'primary' }],
            }),
            buildSubmitField({
              condition: isRejected,
              id: 'rejectApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [{ event: 'REJECT', name: 'Reject', type: 'reject' }],
            }),
          ],
        }),
      ],
    }),
  ],
})
