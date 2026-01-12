import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overview'
import { firstSectionInformation } from './firstSectionInformation'
import { applicantSection } from './applicantSection'
import { secondSectionInformation } from './secondSectionInformation'
import { employmentSearchSection } from './employmentSearchSection'
import { educationSection } from './educationSection'
import { payoutSection } from './payoutSection'
import { employmentInformationSection } from './employmentInformationSection'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: DirectorateOfLabourLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    firstSectionInformation,
    applicantSection,
    employmentInformationSection,
    educationSection,
    payoutSection,
    secondSectionInformation,
    employmentSearchSection,
    overviewSection,
  ],
})
