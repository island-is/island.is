import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { buildForm } from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { FormModes } from '@island.is/application/types'

export const completedForm = buildForm({
  id: 'PrerequisitesForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'conclusion.general.alertTitle',
      alertMessage: 'conclusion.information.title',
      expandableHeader: 'conclusion.information.title',
      expandableIntro: 'conclusion.information.description',
      expandableDescription: 'conclusion.information.bulletList',
    }),
  ],
})
