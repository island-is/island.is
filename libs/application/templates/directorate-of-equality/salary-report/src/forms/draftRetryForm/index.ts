import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { buildSalaryAnalysisSection } from '../mainForm/salaryAnalysisSection'
import { draftRetryReportSummarySection } from './draftRetryReportSummarySection'
import { messages } from '../../lib/messages'

export const draftRetryForm = buildForm({
  id: 'draftRetryForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    // Empty stepper markers — placeholders until these sections get real,
    // editable content (mirrors OJOI's DraftRetry.ts Requirements/Type
    // Selection sections).
    buildSection({
      id: 'draftRetryAboutTheCompany',
      title: messages.draftRetry.aboutTheCompanySectionTitle,
      children: [],
    }),
    buildSection({
      id: 'draftRetryReport',
      title: messages.draftRetry.reportSectionTitle,
      children: [],
    }),
    // The comment thread rides along inside the salary analysis section (top of
    // the úrbótaáætlun screen) rather than on a standalone screen — user
    // testing showed applicants read the comments and the edit form as one
    // task.
    buildSalaryAnalysisSection(
      { hidePostponeCheckbox: true },
      { showComments: true, commentsAlwaysVisible: true },
    ),
    draftRetryReportSummarySection,
  ],
})
