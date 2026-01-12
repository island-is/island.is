import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

export const ApplicantInReviewForm = buildForm({
  id: 'ExamplePending',
  renderLastScreenButton: true,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'inReviewSection',
      tabTitle: 'In review',
      children: [
        buildMultiField({
          id: 'inReviewMultiField',
          title: 'In review',
          children: [
            buildDescriptionField({
              id: 'inReview',
              description:
                'Now you state transfered the application from the DRAFT state to the IN_REVIEW state.',
            }),
            buildDescriptionField({
              id: 'inReview2',
              description:
                'When you triggered the ASSIGN event, the stateMachineOption "assignUser" was run. This assigned the user (gervimaður) with the nationalId that you filled in to be assigned to review the application.',
            }),
            buildDescriptionField({
              id: 'inReview3',
              description:
                'This state also has an onEntry defined in stateMachineConfig.states.inReview.onEntry. This is where the moveToReviewState function in the template-api-module service is run. This function sends a notification (hnipp) to the assignee (gervimaður).',
            }),
            buildDescriptionField({
              id: 'inReview4',
              description:
                'To continue with the application, log in as the assignee (gervimaður) and move the application to the APPROVED or REJECTED state.',
            }),
            buildDescriptionField({
              id: 'inReview5',
              description:
                'NOTE: The hnipp notification does not work locally unless you start up all the needed services, you need to test the application on dev/staging to see the notification.',
            }),
            buildDescriptionField({
              id: 'inReview6',
              description:
                "Another option that you have is to move the application back to the DRAFT state by clicking the button below. This will run the stateMacineOption unAssignUser. That will, as the name suggests, unassign the user (gervimaður) from the application so that we don't run into the case of the application being visible to the assignee but it's in a state that doesn't have a form to render out.",
            }),
            buildSubmitField({
              id: 'submitInReview',
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
