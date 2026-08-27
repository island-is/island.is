import { buildSection } from '@island.is/application/core'
import { messages } from '../../lib/messages'
import {
  buildSalaryAnalysisImprovementPlanSubSection,
  buildSalaryAnalysisOverviewSubSection,
} from '../mainForm/salaryAnalysisSection'
import { hasSeenPostponeReceipt } from '../../utils/salaryAnalysisNavigation'

// Same two sub-sections as the main form, in the opposite order: the plan is
// the only thing left to do here, so it has to be the screen a reopened
// application lands on — and the form shell always opens an IN_PROGRESS form on
// its first navigable screen. The analysis stays reachable from the plan via
// viewAnalysisScreenId (SalaryImprovementPlan renders the button), and is still
// on the way to the report summary and the submit screen.
export const postponedSalaryAnalysisSection = buildSection({
  id: 'salaryAnalysis',
  title: messages.salaryAnalysis.section.sectionTitle,
  condition: hasSeenPostponeReceipt,
  children: [
    buildSalaryAnalysisImprovementPlanSubSection({
      hidePostponeCheckbox: true,
      viewAnalysisScreenId: 'salaryAnalysisOverviewMultiField',
    }),
    buildSalaryAnalysisOverviewSubSection(
      { hidePostponeCheckbox: true },
      { showComments: true },
    ),
  ],
})
