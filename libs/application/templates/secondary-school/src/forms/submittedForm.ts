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
import { conclusion, overview } from '../lib/messages'
import { MmsLogo } from '@island.is/application/assets/institution-logos'
import {
  applicationDataHasBeenPruned,
  ApplicationPeriod,
  checkIsFreshman,
  getDateWordStr,
} from '../utils'

export const Submitted: Form = buildForm({
  id: 'SubmittedForm',
  logo: MmsLogo,
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
              message: (application, locale) => {
                const isFreshman = checkIsFreshman(application.answers)
                const applicationPeriodInfo =
                  getValueViaPath<ApplicationPeriod>(
                    application.externalData,
                    'applicationPeriodInfo.data',
                  )

                const message = isFreshman
                  ? conclusion.overview.alertMessageWithValuesFreshman
                  : conclusion.overview.alertMessageWithValuesGeneral

                const registrationEndDate = isFreshman
                  ? applicationPeriodInfo?.registrationEndDateFreshman
                  : applicationPeriodInfo?.registrationEndDateGeneral

                return {
                  ...message,
                  values: {
                    registrationEndDateStr: getDateWordStr(
                      registrationEndDate,
                      locale,
                    ),
                  },
                }
              },
              condition: (answers) => {
                return !applicationDataHasBeenPruned(answers)
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
              condition: (answers) => !applicationDataHasBeenPruned(answers),
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
