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

export interface VerdictAppealActions {
  // Defendants the prosecution now appeals the verdict of.
  toAppeal: Defendant[]
  // Defendants whose appeal the prosecution takes back.
  toWithdraw: Defendant[]
}

/**
 * The verdict appeals that confirming these decisions comes to.
 *
 * For the prosecution the review decision is the appeal: deciding to appeal
 * files one for that defendant, and changing the decision back takes it away
 * again. Only decisions that were actually saved are acted on, and only those
 * that changed - reconfirming an appeal must not file a second one.
 */
export const getVerdictAppealActions = (
  savedDefendants: Defendant[],
  originalDecisions: ReviewDecisions,
): VerdictAppealActions => ({
  toAppeal: savedDefendants.filter(
    (defendant) =>
      defendant.indictmentReviewDecision ===
      IndictmentCaseReviewDecision.APPEAL,
  ),
  toWithdraw: savedDefendants.filter(
    (defendant) =>
      defendant.indictmentReviewDecision !==
        IndictmentCaseReviewDecision.APPEAL &&
      originalDecisions[defendant.id] === IndictmentCaseReviewDecision.APPEAL,
  ),
})

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
