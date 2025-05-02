import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { conclusion, overview } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { checkIsFreshman } from '../utils'

export const Submitted: Form = buildForm({
  id: 'SubmittedForm',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: '',
      tabTitle: conclusion.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusionMultiField',
          title: conclusion.overview.pageTitle,
          children: [
            buildAlertMessageField({
              id: 'conclusionAlertMessage',
              alertType: 'info',
              title: conclusion.overview.alertTitle,
              message: conclusion.overview.alertMessageFreshman,
              condition: (answers) => {
                return checkIsFreshman(answers)
              },
            }),
            buildAlertMessageField({
              id: 'conclusionAlertMessage',
              alertType: 'info',
              title: conclusion.overview.alertTitle,
              message: conclusion.overview.alertMessageGeneral,
              condition: (answers) => {
                return !checkIsFreshman(answers)
              },
            }),
            buildCustomField({
              component: 'Overview',
              id: 'conclusion',
              description: '',
            }),
            buildMessageWithLinkButtonField({
              id: 'conclusionBottomLink',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: overview.buttons.edit,
                  type: 'signGhost',
                },
              ],
            }),
            buildCustomField({
              component: 'HandleBeforeSubmitInSubmitted',
              id: 'handleBeforeSubmitInSubmitted',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
