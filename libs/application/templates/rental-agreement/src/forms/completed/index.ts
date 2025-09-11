import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { buildForm } from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
  title: m.completed.pageTitle,
  renderLastScreenBackButton: false,
  children: [
    buildFormConclusionSection({
      alertTitle: m.completed.alertMessageSuccessTitle,
      expandableHeader: m.completed.pageInfoTitle,
      expandableIntro: m.completed.pageInfoDescription,
    }),
  ],
})
