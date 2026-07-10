import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const salaryAnalysisSection = buildSection({
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
            buildCustomField({
              id: 'salaryAnalysis',
              component: 'SalaryAnalysisResults',
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
  ],
})
