import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: Logo,
  children: [
    buildFormConclusionSection({
      alertTitle: 'Congratulations',
      alertMessage: 'You have completed this boilerplate application',
    }),
  ],
})
