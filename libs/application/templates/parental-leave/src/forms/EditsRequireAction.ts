import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { States as ApplicationStates } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const EditsRequireAction: Form = buildForm({
  id: 'ParentalLeaveEditsRequireAction',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'EditsRequireAction.section',
      title: '',
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
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'ABORT',
                  name: parentalLeaveFormMessages.editFlow
                    .editsNotApprovedDiscardButton,
                  type: 'reject',
                },
                {
                  event: 'MODIFY',
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
