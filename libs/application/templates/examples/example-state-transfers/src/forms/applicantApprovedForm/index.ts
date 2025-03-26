import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const ApplicantApprovedForm = buildForm({
  id: 'ApplicantApprovedForm',
  title: 'Approved',
  children: [
    buildSection({
      id: 'approvedSection',
      title: 'Samþykkt',
      children: [
        buildMultiField({
          id: 'approvedMultiField',
          title: 'Approved',
          children: [
            buildDescriptionField({
              id: 'approvedDescription',
              description:
                'This application was approved by the person you assigned the application to',
            }),
            buildDescriptionField({
              id: 'approvedDescription2',
              description:
                'The application is now in the APPROVED state. This state is a dead end in the state machine and the application can not be moved out of this state.',
            }),
          ],
        }),
      ],
    }),
  ],
})
