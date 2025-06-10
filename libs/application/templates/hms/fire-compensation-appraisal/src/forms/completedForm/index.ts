import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import HmsLogo from '../../assets/HmsLogo'
import * as m from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: HmsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: m.completedMessages.tabTitle,
      alertTitle: m.completedMessages.alertTitle,
      alertMessage: m.completedMessages.alertMessage,
    }),
  ],
})
