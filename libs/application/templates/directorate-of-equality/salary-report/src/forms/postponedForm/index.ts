import {
  buildForm,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { buildSalaryAnalysisSection } from '../mainForm/salaryAnalysisSection'
import { postponedIntroSection } from './postponedIntroSection'
import { postponedReportSummarySection } from './postponedReportSummarySection'
import { messages } from '../../lib/messages'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { salaryAnalysisOutlierPlanIsReviewed } from '../../utils/salaryAnalysisNavigation'

export const postponedForm = buildForm({
  id: 'postponedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    postponedIntroSection,
    buildSalaryAnalysisSection(
      { hidePostponeCheckbox: true },
      { showComments: true },
    ),
    postponedReportSummarySection,
    buildSection({
      id: 'postponedSubmit',
      title: messages.postponed.sectionTitle,
      condition: salaryAnalysisOutlierPlanIsReviewed,
      children: [
        buildMultiField({
          id: 'postponedSubmitMultiField',
          title: messages.postponed.title,
          description: messages.postponed.intro,
          children: [
            buildOverviewField({
              id: 'postponedSubmitOverview',
              title: messages.postponed.reviewTitle,
              titleVariant: 'h3',
              backId: 'salaryAnalysisOverviewMultiField',
              items: (answers) => {
                const groups =
                  getValueViaPath<OutlierGroupAnswer[]>(
                    answers,
                    'salaryAnalysis.outlierGroups',
                  ) ?? []
                return groups.flatMap((group, index) => [
                  {
                    width: 'full',
                    keyText: messages.salaryAnalysis.outlierGroup.groupHeading,
                    valueText: group.name ? `${group.name}` : `${index + 1}`,
                    // Divider above every group but the first, so groups read
                    // as visually distinct blocks in the review list.
                    ...(index > 0 && { lineAboveKeyText: true }),
                  },
                  {
                    width: 'half',
                    keyText: messages.salaryAnalysis.outlierGroup.reasonLabel,
                    valueText: group.reason ?? '',
                  },
                  {
                    width: 'half',
                    keyText: messages.salaryAnalysis.outlierGroup.actionLabel,
                    valueText: group.action ?? '',
                  },
                  {
                    width: 'half',
                    keyText:
                      messages.salaryAnalysis.outlierGroup.signatureNameLabel,
                    valueText: group.signatureName ?? '',
                  },
                  {
                    width: 'half',
                    keyText:
                      messages.salaryAnalysis.outlierGroup.signatureRoleLabel,
                    valueText: group.signatureRole ?? '',
                  },
                ])
              },
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
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
