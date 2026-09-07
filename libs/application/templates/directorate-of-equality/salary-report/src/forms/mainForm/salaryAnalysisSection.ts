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

// Parameterized so the review states can reuse it with hidePostponeCheckbox:
// true / showComments: true — same fields, same answer paths, different mode.
// showComments embeds the comment thread here instead of a standalone section,
// so the review states never grow a tab of their own that renders empty.
//
// The thread sits at the top of the úrbótaáætlun screen, above the frávik
// table's own title and text: that is the screen the applicant edits, and the
// comments are what they are editing against. That screen is conditional
// (salaryAnalysisNeedsImprovementPlan), so the analysis overview carries the
// thread instead whenever no plan is required — exactly one of the two renders
// it.
//
// commentsAlwaysVisible drops the hasReviewerComment gate and shows a "no
// comments yet" placeholder instead. Used by DRAFT_RETRY, where the applicant
// is there *because* of a comment: the gate reads externalData that is only as
// fresh as the last state transition, and the field refetches the thread
// itself on mount anyway.
export const buildSalaryAnalysisSection = (
  fieldProps?: RecordObject,
  {
    showComments = false,
    commentsAlwaysVisible = false,
  }: { showComments?: boolean; commentsAlwaysVisible?: boolean } = {},
) => {
  const commentThreadField = (
    condition?: Parameters<typeof buildCustomField>[0]['condition'],
  ) =>
    buildCustomField(
      {
        id: 'commentThread',
        title: '',
        component: 'CommentThread',
        condition,
      },
      commentsAlwaysVisible ? { showEmptyState: true } : undefined,
    )

  return buildSection({
    id: 'salaryAnalysis',
    title: messages.salaryAnalysis.section.sectionTitle,
    children: [
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
                    commentThreadField(
                      (answers, externalData) =>
                        !salaryAnalysisNeedsImprovementPlan(
                          answers,
                          externalData,
                        ) &&
                        (commentsAlwaysVisible ||
                          hasReviewerComment(answers, externalData)),
                    ),
                  ]
                : []),
            ],
          }),
        ],
      }),
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
              ...(showComments
                ? [
                    commentThreadField(
                      commentsAlwaysVisible ? undefined : hasReviewerComment,
                    ),
                  ]
                : []),
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
      }),
    ],
  })
}

export const salaryAnalysisSection = buildSalaryAnalysisSection()
