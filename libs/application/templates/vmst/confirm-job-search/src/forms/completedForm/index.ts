import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { conclusion as cm } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
  children: [
    buildFormConclusionSection({
      alertTitle: cm.completedFormAlertTitle,
      multiFieldTitle: cm.multiFieldTitle,
      alertMessage: '',
      accordion: false,
      bottomButtonMessage: cm.bottomButtonMessage,
      bottomButtonLabel: cm.bottomButtonLabel,
    }),
  ],
})
