import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getPublicProsecutorOverviewAssignMode } from './Overview.logic'

describe('getPublicProsecutorOverviewAssignMode', () => {
  const defendantNeedingReview = {
    indictmentCancelledOrDismissedState: null,
    isClosedWithoutEnforcement: false,
    indictmentReviewDecision: null,
  }

  const defendantReviewedAccept = {
    ...defendantNeedingReview,
    indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
  }

  const defendantProsecutionAppealed = {
    ...defendantNeedingReview,
    indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
  }

  const defendantDefenceAppealed = {
    ...defendantNeedingReview,
    indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
    verdict: { appealDate: '2026-09-01T00:00:00.000Z' },
  }

  it('returns reviewer when the verdict is not appealed and review is missing', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        defendants: [defendantNeedingReview],
      }),
    ).toBe('reviewer')
  })

  it('returns appealProsecutor when appealed before review and no appeal prosecutor is set', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        defendants: [
          {
            ...defendantNeedingReview,
            verdict: { appealDate: '2026-09-01T00:00:00.000Z' },
          },
        ],
      }),
    ).toBe('appealProsecutor')
  })

  it('returns appealProsecutor when prosecution appealed and no appeal prosecutor is set', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        defendants: [defendantProsecutionAppealed],
      }),
    ).toBe('appealProsecutor')
  })

  it('returns none when appealed and an appeal prosecutor is already assigned', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        appealProsecutorId: 'prosecutor-id',
        appealProsecutor: { id: 'prosecutor-id' },
        defendants: [defendantProsecutionAppealed],
      }),
    ).toBe('none')
  })

  it('returns none when not appealed and review is complete', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        defendants: [defendantReviewedAccept],
      }),
    ).toBe('none')
  })

  it('returns reviewer for a fine even when a defendant has appeal-like signals', () => {
    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
        defendants: [defendantDefenceAppealed],
      }),
    ).toBe('none')

    expect(
      getPublicProsecutorOverviewAssignMode({
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
        defendants: [defendantNeedingReview],
      }),
    ).toBe('reviewer')
  })
})
