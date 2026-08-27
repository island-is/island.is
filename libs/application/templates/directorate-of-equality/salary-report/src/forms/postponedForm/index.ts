import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { postponeReceiptSection } from './postponeReceiptSection'
import { postponedSalaryAnalysisSection } from './postponedSalaryAnalysisSection'
import { postponedReportSummarySection } from './postponedReportSummarySection'
import { messages } from '../../lib/messages'
import { buildOutlierPlanOverviewField } from '../outlierPlanOverview'
import {
  hasSeenPostponeReceipt,
  salaryAnalysisOutlierPlanIsReviewed,
} from '../../utils/salaryAnalysisNavigation'

export const postponedForm = buildForm({
  id: 'postponedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  // The receipt screen and the rest of the form are mutually exclusive on
  // purpose: on the visit that submitted the report the receipt is the only
  // navigable screen, so the applicant gets the last-screen button instead of
  // being walked on into the úrbótaáætlun. Every later visit is the mirror
  // image — see hasSeenPostponeReceipt.
  children: [
    postponeReceiptSection,
    postponedSalaryAnalysisSection,
    postponedReportSummarySection,
    buildSection({
      id: 'postponedSubmit',
      title: messages.postponed.sectionTitle,
      condition: hasSeenPostponeReceipt,
      children: [
        buildMultiField({
          id: 'postponedSubmitMultiField',
          title: messages.postponed.title,
          description: messages.postponed.intro,
          children: [
            buildOutlierPlanOverviewField({
              id: 'postponedSubmitOverview',
              backId: 'salaryAnalysisImprovementPlanMultiField',
            }),
            buildSubmitField({
              id: 'postponedSubmit',
              title: messages.postponed.submitButton,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: messages.postponed.submitButton,
                  type: 'primary',
                  condition: salaryAnalysisOutlierPlanIsReviewed,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
