import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { buildForm } from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { FormModes } from '@island.is/application/types'
import { completed } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
  title: completed.pageTitle,
  renderLastScreenBackButton: false,
  children: [
    buildFormConclusionSection({
      alertTitle: completed.alertMessageSuccessTitle,
      expandableHeader: completed.pageInfoTitle,
      expandableIntro: completed.pageInfoDescription,
    }),
  ],
})
