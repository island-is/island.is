import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'

import { getChangedReviewDecisions } from './ReviewDecision.logic'

describe('getChangedReviewDecisions', () => {
  const defendants: Defendant[] = [
    { id: 'a', indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL },
    { id: 'b', indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT },
    { id: 'c', indictmentReviewDecision: null },
  ]

  it('returns the defendants whose decision differs from the original', () => {
    const changed = getChangedReviewDecisions(defendants, {
      a: null,
      b: IndictmentCaseReviewDecision.ACCEPT,
      c: null,
    })

    expect(changed.map((d) => d.id)).toEqual(['a'])
  })

  it('treats a changed decision as changed, not only a first one', () => {
    const changed = getChangedReviewDecisions(defendants, {
      a: IndictmentCaseReviewDecision.ACCEPT,
      b: IndictmentCaseReviewDecision.APPEAL,
    })

    expect(changed.map((d) => d.id)).toEqual(['a', 'b'])
  })

  it('never returns a defendant with no decision', () => {
    expect(
      getChangedReviewDecisions(defendants, {
        c: IndictmentCaseReviewDecision.ACCEPT,
      }),
    ).not.toContainEqual(expect.objectContaining({ id: 'c' }))
  })

  it('returns nothing when nothing changed', () => {
    expect(
      getChangedReviewDecisions(defendants, {
        a: IndictmentCaseReviewDecision.APPEAL,
        b: IndictmentCaseReviewDecision.ACCEPT,
        c: null,
      }),
    ).toEqual([])
    expect(getChangedReviewDecisions(undefined, {})).toEqual([])
  })
})
