import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Done: Form = buildForm({
  id: 'PassportApplicationAnnulmentComplete',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      multiFieldTitle: m.applicationComplete,
      alertTitle: m.applicationCompleteAlertTitle,
      alertMessage: '',
      expandableHeader: m.applicationCompleteNextSteps,
      expandableIntro: m.applicationCompleteNextStepsMessage,
      expandableDescription: '',
    }),
  ],
})
