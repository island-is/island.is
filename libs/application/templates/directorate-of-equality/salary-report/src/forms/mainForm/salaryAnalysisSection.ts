import {
  buildCustomField,
  buildDividerField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { hasReviewerComment } from '../commentThreadSection'

// Parameterized so the POSTPONED-state review screen can reuse it with
// hidePostponeCheckbox: true / showComments: true — same field, same answer
// path, different mode. showComments embeds the comment thread here instead
// of a standalone section, since by the time an applicant reaches POSTPONED,
// a reviewer comment is guaranteed to already exist (postponedIntroSection's
// documented invariant), so there's no risk of an empty/broken-looking tab.
export const buildSalaryAnalysisSection = (
  fieldProps?: RecordObject,
  { showComments = false }: { showComments?: boolean } = {},
) =>
  buildSection({
    id: 'salaryAnalysis',
    title: messages.salaryAnalysis.section.sectionTitle,
    children: [
      buildSubSection({
        id: 'salaryAnalysisOverview',
        title: messages.salaryAnalysis.section.sectionTitle,
        children: [
          buildMultiField({
            id: 'salaryAnalysisOverviewMultiField',
            title: messages.salaryAnalysis.section.sectionTitle,
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
              ...(showComments
                ? [
                    buildCustomField({
                      id: 'commentThread',
                      title: '',
                      component: 'CommentThread',
                      condition: hasReviewerComment,
                    }),
                  ]
                : []),
            ],
          }),
        ],
      }),
    ],
  })

export const salaryAnalysisSection = buildSalaryAnalysisSection()
