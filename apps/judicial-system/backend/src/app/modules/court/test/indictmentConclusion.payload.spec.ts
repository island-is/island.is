import { CaseIndictmentRulingDecision } from '@island.is/judicial-system/types'

import { buildIndictmentConclusionContent } from '../court.service'

describe('buildIndictmentConclusionContent', () => {
  const rulingDate = new Date('2026-04-29T15:00:00.000Z')

  it('builds case completion payload for RULING', () => {
    expect(
      buildIndictmentConclusionContent({
        courtCaseNumber: 'S-1/2026',
        isCorrection: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        rulingDate,
      }),
    ).toEqual({
      isCorrection: false,
      courtCaseNumber: 'S-1/2026',
      indictmentRulingDecision: 'RULING',
      rulingDate: '2026-04-29T15:00:00.000Z',
    })
  })

  it('builds WITHDRAWAL payload with judge assignment', () => {
    expect(
      buildIndictmentConclusionContent({
        courtCaseNumber: 'S-1/2026',
        isCorrection: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
        rulingDate,
        wasAssignedToJudge: true,
        judgeNationalId: '0000000000',
      }),
    ).toEqual({
      isCorrection: false,
      courtCaseNumber: 'S-1/2026',
      indictmentRulingDecision: 'WITHDRAWAL',
      rulingDate: '2026-04-29T15:00:00.000Z',
      wasAssignedToJudge: true,
      judgeNationalId: '0000000000',
    })
  })

  it('builds MERGE payload with mergeCaseNumber', () => {
    expect(
      buildIndictmentConclusionContent({
        courtCaseNumber: 'S-2/2026',
        isCorrection: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
        rulingDate,
        mergeCaseNumber: 'S-1/2025',
      }),
    ).toMatchObject({
      indictmentRulingDecision: 'MERGE',
      mergeCaseNumber: 'S-1/2025',
    })
  })

  it('builds per-defendant DISMISSAL payload', () => {
    expect(
      buildIndictmentConclusionContent({
        courtCaseNumber: 'S-1/2026',
        indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
        rulingDate,
        defendantNationalId: '1111111111',
      }),
    ).toMatchObject({
      defendantNationalId: '1111111111',
      indictmentRulingDecision: 'DISMISSAL',
    })
  })

  it('builds split-off payload', () => {
    expect(
      buildIndictmentConclusionContent({
        courtCaseNumber: 'S-1/2026',
        rulingDate,
        defendantNationalId: '1111111111',
        splitCaseNumber: 'S-2/2026',
      }),
    ).toMatchObject({
      indictmentRulingDecision: 'SPLIT',
      splitCaseNumber: 'S-2/2026',
      defendantNationalId: '1111111111',
    })
  })
})
