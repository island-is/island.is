import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overview'
import { firstSectionInformation } from './firstSectionInformation'
import { applicantSection } from './applicantSection'
import { secondSectionInformation } from './secondSectionInformation'
import Logo from '../../assets/Logo'
import { employmentSearchSection } from './employmentSearchSection'
import { educationSection } from './educationSection'
import { payoutSection } from './payoutSection'
import { employmentInformationSection } from './employmentInformationSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: Logo,
  renderLastScreenButton: true,
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
