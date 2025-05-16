import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { applicantSection } from '../mainForm/applicantSection'
import { paymentInformationSection } from './paymentInformationSection'
import { overviewSection } from './overview'
import { jobHistorySection } from './jobHistory'
import { Logo } from '../../assets/Logo'
import { jobWishesSection } from './jobWishesSection'
import { academicBackgroundSection } from './academicBackgroundSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: Logo,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    applicantSection,
    paymentInformationSection,
    jobHistorySection,
    jobWishesSection,
    academicBackgroundSection,
    // drivingLicensesSection,
    // languageSkillsSection,
    // cvSection,
    overviewSection,
  ],
})
