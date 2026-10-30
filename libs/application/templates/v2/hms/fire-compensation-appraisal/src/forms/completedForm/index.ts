import { FormBuilder } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'

export const completedForm = new FormBuilder('completedForm', '', {
  mode: FormModes.COMPLETED,
  logo: HmsLogo,
})
  .addChild(
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: m.completedMessages.tabTitle,
      alertTitle: m.completedMessages.alertTitle,
      alertMessage: m.completedMessages.alertMessage,
    }),
  )
  .build()
