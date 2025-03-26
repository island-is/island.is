import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const AssigneeApprovedForm = buildForm({
  id: 'ApprovedForm',
  children: [
    buildSection({
      id: 'approvedSection',
      tabTitle: 'Samþykkt',
      children: [
        buildMultiField({
          id: 'approvedMultiField',
          title: 'Approved',
          children: [
            buildDescriptionField({
              id: 'approvedDescription',
              description:
                'You approved the application and now it state transfered from the REVIEW state to the APPROVED state.',
            }),
            buildDescriptionField({
              id: 'approvedDescription2',
              description:
                'This state is a dead end in the state machine and the application can not be moved out of this state.',
            }),
          ],
        }),
      ],
    }),
  ],
})
