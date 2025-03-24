import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

export const PendingReview = buildForm({
  id: 'ExamplePending',
  renderLastScreenButton: true,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'waitingToAssignSection',
      tabTitle: 'In review',
      children: [
        buildMultiField({
          id: 'waitingToAssignMultiField',
          title: 'In review',
          children: [
            buildDescriptionField({
              id: 'waitingToAssign',
              description:
                'Now you state transfered the application from the DRAFT state to the WAITING_TO_ASSIGN state.',
            }),
            buildDescriptionField({
              id: 'waitingToAssign2',
              description:
                'When you triggered the ASSIGN event, the stateMachineOption "assignUser" was run. This assigned the user (gervimaður) with the nationalId that you filled in to be assigned to review the application.',
            }),
            buildDescriptionField({
              id: 'waitingToAssign3',
              description:
                'To continue with the application, log in as the assignee (gervimaður) and move the application to the APPROVED or REJECTED state.',
            }),
            buildDescriptionField({
              id: 'waitingToAssign4',
              description:
                "Another option that you have is to move the application back to the DRAFT state by clicking the button below. This will run the stateMacineOption unAssignUser. That will, as the name suggests, unassign the user (gervimaður) from the application so that we don't run into the case of the application being visible to the assignee but it's in a state that doesn't have a form to render out.",
            }),
            buildSubmitField({
              id: 'submitWaiting',
              placement: 'footer',
              title: 'Move application back to DRAFT',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'EDIT',
                  name: 'Move application back to DRAFT',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
