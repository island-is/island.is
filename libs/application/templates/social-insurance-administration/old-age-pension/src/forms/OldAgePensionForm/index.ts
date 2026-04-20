import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { buildForm } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { additionalInformationSection } from './additionalInformationSection'
import { conclusionSection } from './conclusionSection'
import { employmentSection } from './employmentSection'
import { fileUploadSection } from './fileUploadSection'
import { generalInformationSection } from './generalInformationSection'
import { overviewSection } from './overviewSection'
import { periodSection } from './periodSection'

export const OldAgePensionForm: Form = buildForm({
  id: 'OldAgePensionDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    generalInformationSection,
    employmentSection,
    periodSection,
    fileUploadSection,
    additionalInformationSection,
    overviewSection,
    conclusionSection,
  ],
})
