import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { application as am } from './../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: am.multiFieldTitle,
      alertTitle: am.completedFormAlertTitle,
      alertMessage: '',
      accordion: false,
      bottomButtonLabel: am.bottomButtonLabel,
      bottomButtonMessage: am.bottomButtonMessage,
      bottomButtonLink: '/minarsidur/framfaersla/atvinnuleysisbaetur/minstada',
    }),
  ],
})
