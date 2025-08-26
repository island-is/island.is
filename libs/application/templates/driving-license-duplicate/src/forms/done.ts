import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const done: Form = buildForm({
  id: 'DrivingLicenseDuplicateApplicationComplete',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: m.congratulationsTitle,
      alertTitle: m.congratulationsTitle,
      alertMessage: m.congratulationsTitleSuccess,
      expandableHeader: m.congratulationsNextStepsTitle,
      expandableDescription: m.congratulationsNextStepsDescription,
    }),
  ],
})
