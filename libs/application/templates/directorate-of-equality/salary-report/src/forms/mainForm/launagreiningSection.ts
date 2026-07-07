import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const launagreiningSection = buildSection({
  id: 'salaryAnalysis',
  title: messages.salaryAnalysis.section.sectionTitle,
  children: [
    buildSubSection({
      id: 'salaryAnalysisOverview',
      title: messages.salaryAnalysis.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'salaryAnalysisOverviewMultiField',
          title: messages.salaryAnalysis.overview.title,
          description: messages.salaryAnalysis.overview.intro,
          children: [
            buildDescriptionField({
              id: 'salaryAnalysis.overview.placeholder',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'improvementPlan',
      title: messages.salaryAnalysis.improvementPlan.sectionTitle,
      condition: (answers) =>
        getValueViaPath(answers, 'salaryAnalysis.requiresImprovementPlan') ===
        'yes',
      children: [
        buildMultiField({
          id: 'improvementPlanMultiField',
          title: messages.salaryAnalysis.improvementPlan.title,
          description: messages.salaryAnalysis.improvementPlan.intro,
          children: [
            buildDescriptionField({
              id: 'improvementPlan.placeholder',
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
