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

export const EditsRequireAction: Form = buildForm({
  id: 'ParentalLeaveEditsRequireAction',
  title: inReviewFormMessages.formTitle,
  logo: DirectorateOfLabourLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'EditsRequireAction.section',
      children: [
        buildMultiField({
          id: 'editsRequireAction.multiField',
          title: parentalLeaveFormMessages.editFlow.editsNotApprovedTitle,
          description: (application) => {
            return application.state === ApplicationStates.EMPLOYER_EDITS_ACTION
              ? parentalLeaveFormMessages.editFlow.editsNotApprovedEmployerDesc
              : parentalLeaveFormMessages.editFlow.editsNotApprovedVMLSTDesc
          },
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: parentalLeaveFormMessages.editFlow
                    .editsNotApprovedDiscardButton,
                  type: 'reject',
                },
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
