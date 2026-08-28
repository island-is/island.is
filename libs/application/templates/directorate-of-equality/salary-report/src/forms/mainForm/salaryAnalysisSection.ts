import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import type { RecordObject } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { ScreenIds } from '../../utils/constants'
import { salaryAnalysisNeedsImprovementPlan } from '../../utils/salaryAnalysisNavigation'
import { hasReviewerComment } from '../commentThreadSection'

// Parameterized so the POSTPONED-state review screen can reuse it with
// hidePostponeCheckbox: true / showComments: true — same field, same answer
// path, different mode. showComments embeds the comment thread here instead of
// a standalone section, so the review states never grow a tab of their own that
// renders empty: the thread appears only once a reviewer has actually commented
// (condition: hasReviewerComment).
export const buildSalaryAnalysisOverviewSubSection = (
  fieldProps?: RecordObject,
  { showComments = false }: { showComments?: boolean } = {},
) =>
  buildSubSection({
    id: 'salaryAnalysisOverview',
    title: messages.salaryAnalysis.overview.sectionTitle,
    children: [
      buildMultiField({
        id: ScreenIds.analysisOverview,
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
  })

export const buildSalaryAnalysisImprovementPlanSubSection = (
  fieldProps?: RecordObject,
) =>
  buildSubSection({
    id: 'salaryAnalysisImprovementPlan',
    title: messages.salaryAnalysis.improvementPlan.sectionTitle,
    condition: salaryAnalysisNeedsImprovementPlan,
    children: [
      buildMultiField({
        id: ScreenIds.improvementPlan,
        title: messages.salaryAnalysis.improvementPlan.title,
        description: messages.salaryAnalysis.improvementPlan.intro,
        children: [
          buildCustomField(
            {
              id: 'salaryAnalysis',
              component: 'SalaryImprovementPlan',
              doesNotRequireAnswer: true,
            },
            fieldProps,
          ),
        ],
      }),
    ],
  })

// Analysis first, then the plan it feeds. POSTPONED composes the same two
// sub-sections in the opposite order — see postponedSalaryAnalysisSection.
export const buildSalaryAnalysisSection = (
  fieldProps?: RecordObject,
  { showComments = false }: { showComments?: boolean } = {},
) =>
  buildSection({
    id: 'salaryAnalysis',
    title: messages.salaryAnalysis.section.sectionTitle,
    children: [
      buildSalaryAnalysisOverviewSubSection(fieldProps, { showComments }),
      buildSalaryAnalysisImprovementPlanSubSection(fieldProps),
    ],
  })

export const salaryAnalysisSection = buildSalaryAnalysisSection()
