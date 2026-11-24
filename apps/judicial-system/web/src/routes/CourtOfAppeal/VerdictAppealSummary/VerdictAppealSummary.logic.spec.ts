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
  getCompletableVerdictAppealRulingFile,
  getVerdictAppealRulingDecisionLabel,
  getVerdictAppealRulingFiles,
} from './VerdictAppealSummary.logic'

const rulingFile = {
  id: 'ruling-file',
  category: CaseFileCategory.VERDICT_APPEAL_RULING,
  type: 'application/pdf',
  key: 'uploads/case-id/ruling-file/domur.pdf',
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

const withRulingFiles = (caseFiles: Record<string, unknown>[]) =>
  ({ ...readyCase, caseFiles } as unknown as WorkingCase)

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
    ['concluding words, only whitespace', { appealConclusion: '   \n ' }],
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

describe('the ruling document', () => {
  it('is not enough without a stored key', () => {
    const withoutKey = withRulingFiles([{ ...rulingFile, key: null }])

    expect(canCompleteVerdictAppeal(withoutKey)).toBe(false)
    expect(getCompletableVerdictAppealRulingFile(withoutKey)).toBeUndefined()
  })

  it('is not enough when it is not a PDF', () => {
    const notPdf = withRulingFiles([
      { ...rulingFile, type: 'application/msword' },
    ])

    expect(canCompleteVerdictAppeal(notPdf)).toBe(false)
    expect(getCompletableVerdictAppealRulingFile(notPdf)).toBeUndefined()
  })

  it('is the stored PDF among several ruling files', () => {
    const storedPdf = { ...rulingFile, id: 'stored-pdf' }
    const several = withRulingFiles([
      { ...rulingFile, id: 'unstored-pdf', key: null },
      { ...rulingFile, id: 'stored-word', type: 'application/msword' },
      storedPdf,
    ])

    expect(canCompleteVerdictAppeal(several)).toBe(true)
    expect(getCompletableVerdictAppealRulingFile(several)).toEqual(storedPdf)
  })
})

describe('getVerdictAppealRulingFiles', () => {
  it('keeps only the Court of Appeals document', () => {
    expect(getVerdictAppealRulingFiles(readyCase)).toEqual([rulingFile])
  })
})

describe('getVerdictAppealRulingDecisionLabel', () => {
  it('names the outcome', () => {
    expect(
      getVerdictAppealRulingDecisionLabel(readyCase.verdictAppealCase),
    ).toBe('Staðfesting')
  })

  it('is undefined before there is one', () => {
    expect(
      getVerdictAppealRulingDecisionLabel({ appealRulingDecision: null }),
    ).toBeUndefined()
    expect(getVerdictAppealRulingDecisionLabel(undefined)).toBeUndefined()
  })
})
