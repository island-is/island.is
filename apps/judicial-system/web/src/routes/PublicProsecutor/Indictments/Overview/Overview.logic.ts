import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

export type PublicProsecutorOverviewAssignMode =
  | 'reviewer'
  | 'appealProsecutor'
  | 'none'

type AssignModeDefendant = {
  indictmentCancelledOrDismissedState?: unknown
  isClosedWithoutEnforcement?: boolean | null
  indictmentReviewDecision?: IndictmentCaseReviewDecision | null
  // Web Case exposes a single latest `verdict`; backend includes use `verdicts[0]`.
  verdict?: { appealDate?: string | null } | null
  verdicts?: Array<{ appealDate?: string | null }> | null
}

type AssignModeCase = {
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null
  appealProsecutorId?: string | null
  appealProsecutor?: { id: string } | null
  defendants?: Array<AssignModeDefendant> | null
}

const hasAppealedVerdict = (workingCase: AssignModeCase): boolean =>
  workingCase.indictmentRulingDecision ===
    CaseIndictmentRulingDecision.RULING &&
  Boolean(
    workingCase.defendants?.some(
      (defendant) =>
        defendant.indictmentReviewDecision ===
          IndictmentCaseReviewDecision.APPEAL ||
        Boolean(
          defendant.verdicts?.[0]?.appealDate ?? defendant.verdict?.appealDate,
        ),
    ),
  )

const isReviewMissing = (workingCase: AssignModeCase): boolean =>
  Boolean(
    workingCase.defendants?.some(
      (defendant) =>
        !defendant.indictmentCancelledOrDismissedState &&
        !defendant.isClosedWithoutEnforcement &&
        !defendant.indictmentReviewDecision,
    ),
  )

const hasAppealProsecutor = (workingCase: AssignModeCase): boolean =>
  Boolean(workingCase.appealProsecutorId ?? workingCase.appealProsecutor?.id)

export const getPublicProsecutorOverviewAssignMode = (
  workingCase: AssignModeCase,
): PublicProsecutorOverviewAssignMode => {
  if (hasAppealedVerdict(workingCase) && !hasAppealProsecutor(workingCase)) {
    return 'appealProsecutor'
  }

  if (isReviewMissing(workingCase)) {
    return 'reviewer'
  }

  return 'none'
}
