import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.tabTitle,
      multiFieldTitle: conclusion.tabTitle,
      alertTitle: conclusion.alertTitle,
      alertMessage: conclusion.alertInfo,
      expandableIntro: conclusion.expandableIntro,
      expandableDescription: '',
    }),
  ],
})
