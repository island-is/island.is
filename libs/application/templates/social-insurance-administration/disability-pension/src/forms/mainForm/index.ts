import { buildForm } from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { FormModes } from '@island.is/application/types'
import { basicInfoSection } from './basicInfoSection'
import { disabilityCertificateSection } from './disabilityCertificate'
import { extraInfoSection } from './extraInfo'
import { overviewSection } from './overview'
import { selfEvaluationSection } from './selfEvaluation'
import { conclusionSection } from './conclusion'

export const MainForm = buildForm({
  id: 'disabilityPensionMain',
  mode: FormModes.DRAFT,
  logo: SocialInsuranceAdministrationLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    basicInfoSection,
    selfEvaluationSection,
    disabilityCertificateSection,
    extraInfoSection,
    overviewSection,
    conclusionSection,
  ],
})
