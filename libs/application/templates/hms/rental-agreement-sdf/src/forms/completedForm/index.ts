import { FormBuilder } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const completedForm = new FormBuilder('rentalAgreementSdfCompleted', '', {
  mode: FormModes.COMPLETED,
})
  .addChild(
    buildFormConclusionSection({
      alertTitle: 'Húsaleigusamningur móttekinn',
      alertMessage: 'Drög að húsaleigusamningi hafa verið vistuð.',
    }),
  )
  .build()
