import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { messages } from '../../lib/messages'

// Parameterized so the POSTPONED-state review screen can reuse it with
// hidePostponeCheckbox: true — same field, same answer path, different mode.
export const buildSalaryAnalysisSection = (fieldProps?: RecordObject) =>
  buildSection({
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
              buildCustomField(
                {
                  id: 'salaryAnalysis',
                  component: 'SalaryAnalysisResults',
                  doesNotRequireAnswer: true,
                },
                fieldProps,
              ),
            ],
          }),
        ],
      }),
    ],
  })

export const salaryAnalysisSection = buildSalaryAnalysisSection()
