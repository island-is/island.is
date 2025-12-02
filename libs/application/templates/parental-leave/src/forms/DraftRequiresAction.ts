import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { States as ApplicationStates } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const DraftRequiresAction: Form = buildForm({
  id: 'ParentalLeaveSubmissionNeedsAction',
  title: inReviewFormMessages.formTitle,
  logo: DirectorateOfLabourLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'draftRequiresAction.section',
      children: [
        buildMultiField({
          id: 'draftRequiresAction.multiField',
          title: parentalLeaveFormMessages.draftFlow.draftNotApprovedTitle,
          description: (application) => {
            return application.state === ApplicationStates.OTHER_PARENT_ACTION
              ? parentalLeaveFormMessages.draftFlow
                  .draftNotApprovedOtherParentDesc
              : application.state === ApplicationStates.EMPLOYER_ACTION
              ? parentalLeaveFormMessages.draftFlow.draftNotApprovedEmployerDesc
              : parentalLeaveFormMessages.draftFlow.draftNotApprovedVMLSTDesc
          },
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: parentalLeaveFormMessages.reviewScreen.buttonsEdit,
                  type: 'sign',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
