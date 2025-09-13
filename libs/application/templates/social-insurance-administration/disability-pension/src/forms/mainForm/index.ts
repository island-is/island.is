import { buildForm } from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
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
  logo: Logo,
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
