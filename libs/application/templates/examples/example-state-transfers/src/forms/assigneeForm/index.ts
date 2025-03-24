import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'

export const AssigneeForm = buildForm({
  id: 'AssigneeForm',
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'assigneeInfo',
      tabTitle: 'Review application',
      children: [
        buildMultiField({
          id: 'assigneeInfoMultiField',
          title: 'Assignee Info',
          children: [
            buildDescriptionField({
              id: 'description',
              description:
                'You are now viewing this application as the assignee that is going to review and choose to approve or reject.',
            }),
            buildRadioField({
              id: 'approveOrReject',
              title: 'Approve or reject',
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

            // Use condition to show the correct submit button
            buildSubmitField({
              condition: (application) =>
                getValueViaPath<string>(application, 'approveOrReject') ===
                'approve',
              id: 'submitApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [{ event: 'APPROVE', name: 'Approve', type: 'primary' }],
            }),
            buildSubmitField({
              condition: (application) =>
                getValueViaPath<string>(application, 'approveOrReject') ===
                'reject',
              id: 'submitApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [{ event: 'REJECT', name: 'Reject', type: 'primary' }],
            }),
          ],
        }),
      ],
    }),
  ],
})
