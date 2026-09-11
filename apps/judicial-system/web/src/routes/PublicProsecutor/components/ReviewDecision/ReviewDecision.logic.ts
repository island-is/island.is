import type {
  Defendant,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
