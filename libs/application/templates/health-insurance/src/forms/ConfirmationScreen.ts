import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from './messages'
import Logo from '../assets/Logo'
import { formConclusionSection } from '@island.is/application/ui-forms'

export const HealthInsuranceConfirmation: Form = buildForm({
  id: 'HealthInsuranceConfirmation',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    formConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }),
  ],
})
