import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { paymentInformationSection } from './paymentInformationSection'
import { overviewSection } from './overviewSection'
import { jobHistorySection } from './jobHistory'
import { jobWishesSection } from './jobWishesSection'
import { academicBackgroundSection } from './academicBackgroundSection'
import { drivingLicensesSection } from './drivingLicensesSection'
import { languageSkillsSection } from './languageSkillsSection'
import { cvSection } from './cvSection'
import { incomeSection } from './incomeSection'
import { applicantSection } from './personalInformationSection'
import { reportingObligationSection } from './reportingObligationSection'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: DirectorateOfLabourLogo,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    applicantSection,
    paymentInformationSection,
    incomeSection,
    jobWishesSection,
    jobHistorySection,
    academicBackgroundSection,
    drivingLicensesSection,
    languageSkillsSection,
    cvSection,
    overviewSection,
    reportingObligationSection,
  ],
})
