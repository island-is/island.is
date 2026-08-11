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

export const postponedForm = buildForm({
  id: 'postponedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    postponedIntroSection,
    postponedReportSummarySection,
    buildSalaryAnalysisSection({ hidePostponeCheckbox: true }),
    buildSection({
      id: 'postponedSubmit',
      title: messages.postponed.sectionTitle,
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
              items: (answers) => [
                {
                  width: 'full',
                  keyText: messages.salaryAnalysis.outlierGroup.reasonLabel,
                  valueText:
                    getValueViaPath<string>(
                      answers,
                      'salaryAnalysis.outlierGroups.0.reason',
                    ) ?? '',
                },
                {
                  width: 'full',
                  keyText: messages.salaryAnalysis.outlierGroup.actionLabel,
                  valueText:
                    getValueViaPath<string>(
                      answers,
                      'salaryAnalysis.outlierGroups.0.action',
                    ) ?? '',
                },
                {
                  width: 'half',
                  keyText:
                    messages.salaryAnalysis.outlierGroup.signatureNameLabel,
                  valueText:
                    getValueViaPath<string>(
                      answers,
                      'salaryAnalysis.outlierGroups.0.signatureName',
                    ) ?? '',
                },
                {
                  width: 'half',
                  keyText:
                    messages.salaryAnalysis.outlierGroup.signatureRoleLabel,
                  valueText:
                    getValueViaPath<string>(
                      answers,
                      'salaryAnalysis.outlierGroups.0.signatureRole',
                    ) ?? '',
                },
              ],
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
