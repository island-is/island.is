import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { applicantInformationSection } from './aplicantInformationSection'
import { statusAndChildrenSection } from './statusAndChildrenSection'
import { formerInsuranceSection } from './formerInsuranceSection'
import { confirmSection } from './confirmSection'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
  children: [
    applicantInformationSection,
    statusAndChildrenSection,
    formerInsuranceSection,
    confirmSection,
    buildFormConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }),
  ],
})
