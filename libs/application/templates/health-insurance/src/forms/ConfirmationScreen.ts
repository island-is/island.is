import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages/messages'
import Logo from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const HealthInsuranceConfirmation: Form = buildForm({
  id: 'HealthInsuranceConfirmation',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }),
  ],
})
