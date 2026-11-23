import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealRulingType,
  CaseFileCategory,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  canCompleteVerdictAppeal,
  getVerdictAppealRulingDecisionLabel,
  getVerdictAppealRulingFiles,
} from './VerdictAppealSummary.logic'

const rulingFile = {
  id: 'ruling-file',
  category: CaseFileCategory.VERDICT_APPEAL_RULING,
}

const readyCase = {
  caseFiles: [
    { id: 'other-file', category: CaseFileCategory.APPEAL_RULING },
    rulingFile,
  ],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.APPEALED,
    verdictAppealStatus: VerdictAppealStatus.COMPLETED,
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
  },
} as unknown as WorkingCase

const withAppeal = (update: Record<string, unknown>) =>
  ({
    ...readyCase,
    verdictAppealCase: { ...readyCase.verdictAppealCase, ...update },
  } as unknown as WorkingCase)

describe('canCompleteVerdictAppeal', () => {
  it('is true for an open appeal marked finished with everything recorded', () => {
    expect(canCompleteVerdictAppeal(readyCase)).toBe(true)
  })

  it('is false without a verdict appeal', () => {
    expect(
      canCompleteVerdictAppeal({
        ...readyCase,
        verdictAppealCase: null,
      } as unknown as WorkingCase),
    ).toBe(false)
  })

  it.each([
    AppealCaseState.COMPLETED,
    AppealCaseState.RECEIVED,
    AppealCaseState.WITHDRAWN,
  ])('is false for an appeal in state %s', (appealState) => {
    expect(canCompleteVerdictAppeal(withAppeal({ appealState }))).toBe(false)
  })

  it('is false until the court marks the appeal finished', () => {
    expect(
      canCompleteVerdictAppeal(
        withAppeal({
          verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
        }),
      ),
    ).toBe(false)
    expect(
      canCompleteVerdictAppeal(withAppeal({ verdictAppealStatus: null })),
    ).toBe(false)
  })

  it.each([
    ['outcome', { appealRulingDecision: null }],
    ['type', { appealRulingType: null }],
    ['concluding words', { appealConclusion: '' }],
  ])('is false without the %s', (_name, update) => {
    expect(canCompleteVerdictAppeal(withAppeal(update))).toBe(false)
  })

  it('is false without the document', () => {
    expect(
      canCompleteVerdictAppeal({
        ...readyCase,
        caseFiles: [
          { id: 'other-file', category: CaseFileCategory.APPEAL_RULING },
        ],
      } as unknown as WorkingCase),
    ).toBe(false)
    expect(
      canCompleteVerdictAppeal({
        ...readyCase,
        caseFiles: undefined,
      } as unknown as WorkingCase),
    ).toBe(false)
  })
})

describe('getVerdictAppealRulingFiles', () => {
  it('keeps only the Court of Appeals document', () => {
    expect(getVerdictAppealRulingFiles(readyCase)).toEqual([rulingFile])
  })
})

describe('getVerdictAppealRulingDecisionLabel', () => {
  it('names the outcome', () => {
    expect(getVerdictAppealRulingDecisionLabel(readyCase)).toBe('Staðfesting')
  })

  it('is undefined before there is one', () => {
    expect(
      getVerdictAppealRulingDecisionLabel(
        withAppeal({ appealRulingDecision: null }),
      ),
    ).toBeUndefined()
  })
})
