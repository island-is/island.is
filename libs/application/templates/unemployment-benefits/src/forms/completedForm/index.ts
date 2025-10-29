import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'
import { application as applicationMessages } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: Logo,
  children: [
    buildFormConclusionSection({
      alertTitle: applicationMessages.successSubmissionTitle,
      alertMessage: applicationMessages.successSubmissionDescription,
      expandableDescription: applicationMessages.whatHappensNextContent,
      infoAlertTitle: applicationMessages.infoAlertTitle,
      infoAlertMessage: applicationMessages.infoAlertDescription,
    }),
  ],
})
