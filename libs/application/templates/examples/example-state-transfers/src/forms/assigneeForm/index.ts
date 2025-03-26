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
              id: 'assigneeDescription',
              description:
                'You are now viewing this application as the assignee that is going to review and choose to approve or reject.',
            }),
            buildDescriptionField({
              id: 'assigneeDescription2',
              description:
                'Here you can include an overview of the application to aid with the decision making process.',
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
              id: 'approveApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [{ event: 'APPROVE', name: 'Approve', type: 'primary' }],
            }),
            buildSubmitField({
              condition: (application) =>
                getValueViaPath<string>(application, 'approveOrReject') ===
                'reject',
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
