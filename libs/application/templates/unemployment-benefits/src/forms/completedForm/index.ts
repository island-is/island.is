import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
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
