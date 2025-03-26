import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const AssigneeRejectedForm = buildForm({
  id: 'RejectedForm',
  children: [
    buildSection({
      id: 'rejectedSection',
      tabTitle: 'Hafnað',
      children: [
        buildMultiField({
          id: 'rejectedMultiField',
          title: 'Rejected',
          children: [
            buildDescriptionField({
              id: 'rejectedDescription',
              description:
                'You rejected the application and now it state transfered from the REVIEW state to the REJECTED state.',
            }),
            buildDescriptionField({
              id: 'rejectedDescription2',
              description:
                'This state is a dead end in the state machine and the application can not be moved out of this state.',
            }),
          ],
        }),
      ],
    }),
  ],
})
