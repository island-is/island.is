import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { postponedReviewSection } from './postponedReviewSection'
import { buildSalaryAnalysisSection } from '../mainForm/salaryAnalysisSection'

// The úrbótaáætlun flow, entered once the applicant has closed the receipt (see
// States.POSTPONE_RECEIVED). Nothing here is conditional: the receipt lives in
// the other state's form, so this one opens on the salary analysis every time.
export const postponedForm = buildForm({
  id: 'postponedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSalaryAnalysisSection(
      { hidePostponeCheckbox: true },
      { showComments: true },
    ),
    postponedReviewSection,
  ],
})
