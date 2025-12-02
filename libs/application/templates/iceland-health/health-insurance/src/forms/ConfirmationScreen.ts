import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const HealthInsuranceConfirmation: Form = buildForm({
  id: 'HealthInsuranceConfirmation',
  title: m.formTitle,
  logo: IcelandHealthLogo,
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
