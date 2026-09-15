import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getChangedReviewDecisions,
  getReviewDecisionLabel,
  getVerdictAppealActions,
  isLateVerdictAppeal,
} from './ReviewDecision.logic'

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

describe('getReviewDecisionLabel', () => {
  it('should read as the radio the reviewer picked', () => {
    expect(
      getReviewDecisionLabel(IndictmentCaseReviewDecision.APPEAL, false),
    ).toBe('Áfrýja héraðsdómi til Landsréttar')
    expect(
      getReviewDecisionLabel(IndictmentCaseReviewDecision.ACCEPT, false),
    ).toBe('Una héraðsdómi')
  })

  it('should say kæra rather than áfrýjun for a fine', () => {
    expect(
      getReviewDecisionLabel(IndictmentCaseReviewDecision.APPEAL, true),
    ).toBe('Kæra viðurlagaákvörðun til Landsréttar')
    expect(
      getReviewDecisionLabel(IndictmentCaseReviewDecision.ACCEPT, true),
    ).toBe('Una viðurlagaákvörðun')
  })
})

describe('getVerdictAppealActions', () => {
  const appeals: Defendant = {
    id: 'appeals',
    indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
  }
  const accepts: Defendant = {
    id: 'accepts',
    indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
  }

  it('should file an appeal for every defendant it was decided for', () => {
    expect(getVerdictAppealActions([appeals, accepts], {})).toEqual({
      toAppeal: [appeals],
      toWithdraw: [],
    })
  })

  // Changing the decision back takes the appeal away again.
  it('should withdraw the appeal of a defendant changed away from it', () => {
    expect(
      getVerdictAppealActions([accepts], {
        accepts: IndictmentCaseReviewDecision.APPEAL,
      }),
    ).toEqual({ toAppeal: [], toWithdraw: [accepts] })
  })

  // Only a decision that stood as an appeal has one to take back.
  it('should not withdraw for a defendant who never appealed', () => {
    expect(
      getVerdictAppealActions([accepts], {
        accepts: null,
      }),
    ).toEqual({ toAppeal: [], toWithdraw: [] })
  })

  it('should do nothing when nothing was saved', () => {
    expect(getVerdictAppealActions([], {})).toEqual({
      toAppeal: [],
      toWithdraw: [],
    })
  })
})

describe('isLateVerdictAppeal', () => {
  const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const appeals: Defendant = {
    id: 'appeals',
    indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
  }
  const accepts: Defendant = {
    id: 'accepts',
    indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
  }

  it('should be late when an appeal is made after the deadline', () => {
    expect(isLateVerdictAppeal([appeals], past)).toBe(true)
  })

  it('should not be late while the deadline still runs', () => {
    expect(isLateVerdictAppeal([appeals], future)).toBe(false)
  })

  // The deadline is the prosecution's to appeal by; accepting is never late.
  it('should not be late when no appeal is being made', () => {
    expect(isLateVerdictAppeal([accepts], past)).toBe(false)
  })

  it('should not be late without a deadline to be late for', () => {
    expect(isLateVerdictAppeal([appeals], null)).toBe(false)
  })
})
