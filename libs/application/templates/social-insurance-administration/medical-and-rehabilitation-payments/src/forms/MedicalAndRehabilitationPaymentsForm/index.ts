import { buildForm } from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { commentSection } from './commentSection'
import { conclusionSection } from './conclusionSection'
import { generalInformationSection } from './generalInformationSection'
import { overviewSection } from './overviewSection'
import { rehabilitationPlanSection } from './rehabilitationPlanSection'
import { selfAssessmentSection } from './selfAssessmentSection'

export const MedicalAndRehabilitationPaymentsForm: Form = buildForm({
  id: 'MedicalAndrehabilitationPaymentsDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    generalInformationSection,
    // Grunnvottorð
    rehabilitationPlanSection,
    selfAssessmentSection,
    commentSection,
    overviewSection,
    conclusionSection,
  ],
})
