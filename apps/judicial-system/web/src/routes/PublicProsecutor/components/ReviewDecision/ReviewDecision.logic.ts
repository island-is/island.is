import { hasDatePassed } from '@island.is/judicial-system/types'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'

export type ReviewDecisions = Record<
  string,
  IndictmentCaseReviewDecision | null | undefined
>

// The defendants whose review decision differs from the one the page loaded
// with. Confirming saves these and no others: a decision that did not change
// is not an act of review, and the backend records a review event for every
// decision it is sent.
export const getChangedReviewDecisions = (
  defendants: Defendant[] | undefined,
  originalDecisions: ReviewDecisions,
): Defendant[] =>
  (defendants ?? []).filter(
    (defendant) =>
      defendant.indictmentReviewDecision !== undefined &&
      defendant.indictmentReviewDecision !== null &&
      defendant.indictmentReviewDecision !== originalDecisions[defendant.id],
  )

// The decision as the confirmation spells it out, in the same words as the radio
// the reviewer picked.
export const getReviewDecisionLabel = (
  decision: IndictmentCaseReviewDecision | null | undefined,
  isFine: boolean,
): string => {
  if (decision === IndictmentCaseReviewDecision.APPEAL) {
    return isFine
      ? 'Kæra viðurlagaákvörðun til Landsréttar'
      : 'Áfrýja héraðsdómi til Landsréttar'
  }

  return isFine ? 'Una viðurlagaákvörðun' : 'Una héraðsdómi'
}

/**
 * Whether confirming these decisions means appealing after the prosecution's
 * own deadline has run out. The deadline is soft - a late appeal is allowed -
 * so this only decides whether the confirmation warns about it first.
 */
export const isLateVerdictAppeal = (
  changedDefendants: Defendant[],
  indictmentAppealDeadline: string | null | undefined,
): boolean =>
  Boolean(
    indictmentAppealDeadline &&
      hasDatePassed(new Date(indictmentAppealDeadline)) &&
      changedDefendants.some(
        (defendant) =>
          defendant.indictmentReviewDecision ===
          IndictmentCaseReviewDecision.APPEAL,
      ),
  )
