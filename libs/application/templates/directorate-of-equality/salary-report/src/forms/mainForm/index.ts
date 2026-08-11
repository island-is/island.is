import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { aboutTheCompanySection } from './aboutTheCompanySection'
import { reportSection } from './reportSection'
import { salaryAnalysisSection } from './salaryAnalysisSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    aboutTheCompanySection,
    reportSection,
    salaryAnalysisSection,
    overviewSection,
  ],
})
