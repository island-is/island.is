import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { ApplicationType } from '../utils'

export const Submitted: Form = buildForm({
  id: 'SubmittedForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: '',
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
                return (
                  getValueViaPath<ApplicationType>(
                    answers,
                    'applicationType.value',
                  ) === ApplicationType.FRESHMAN
                )
              },
            }),
            buildAlertMessageField({
              id: 'conclusionAlertMessage',
              alertType: 'info',
              title: conclusion.overview.alertTitle,
              message: conclusion.overview.alertMessageGeneral,
              condition: (answers) => {
                return (
                  getValueViaPath<ApplicationType>(
                    answers,
                    'applicationType.value',
                  ) !== ApplicationType.FRESHMAN
                )
              },
            }),
            buildCustomField({
              component: 'Overview',
              id: 'conclusion',
              title: '',
              description: '',
            }),
            buildMessageWithLinkButtonField({
              id: 'conclusionBottomLink',
              title: '',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: conclusion.overview.editButton,
                  type: 'subtle',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
