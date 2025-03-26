import {
  buildDescriptionField,
  buildForm,
  buildSection,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'

export const ApplicantRejectedForm = buildForm({
  id: 'RejectedForm',
  children: [
    buildSection({
      id: 'rejectedSection',
      tabTitle: 'Rejected',
      children: [
        buildMultiField({
          id: 'rejectedMultiField',
          title: 'Rejected by assignee',
          children: [
            buildDescriptionField({
              id: 'approvedDescription',
              description:
                'This application was rejected by the person you assigned the application to',
            }),
            buildDescriptionField({
              id: 'approvedDescription2',
              description:
                'The application is now in the REJECTED state. This state is a dead end in the state machine and the application can not be moved out of this state.',
            }),
            buildDescriptionField({
              id: 'approvedDescription3',
              description:
                'The application was rejected with the following reason:',
            }),
            buildDescriptionField({
              id: 'approvedDescription4',
              description: (application) => {
                const reason = getValueViaPath<string>(
                  application.answers,
                  'approveOrRejectReason',
                )
                return reason ?? 'No reason provided'
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
