import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { paymentInformationSection } from './paymentInformationSection'
import { overviewSection } from './overviewSection'
import { jobHistorySection } from './jobHistory'
import { Logo } from '../../assets/Logo'
import { jobWishesSection } from './jobWishesSection'
import { academicBackgroundSection } from './academicBackgroundSection'
import { drivingLicensesSection } from './drivingLicensesSection'
import { languageSkillsSection } from './languageSkillsSection'
import { cvSection } from './cvSection'
import { incomeSection } from './incomeSection'
import { applicantSection } from './personalInformationSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: Logo,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    applicantSection,
    paymentInformationSection,
    incomeSection,
    jobHistorySection,
    jobWishesSection,
    academicBackgroundSection,
    drivingLicensesSection,
    languageSkillsSection,
    cvSection,
    overviewSection,
  ],
})
