import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import HmsLogo from '../../assets/HmsLogo'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: HmsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'Congratulations',
      alertMessage: 'You have completed this boilerplate application',
    }),
  ],
})
