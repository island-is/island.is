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
  getVerdictAppealRulingDateMinDate,
  getVerdictAppealRulingDecisionLabel,
  getVerdictAppealRulingFiles,
  isSameVerdictAppealRulingDate,
  isVerdictAppealOutcomeShown,
  isVerdictAppealRulingDateInRange,
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
    appealRulingDate: '2024-01-10T00:00:00.000Z',
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
    ['date the appeal ended', { appealRulingDate: null }],
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

describe('isVerdictAppealOutcomeShown', () => {
  it('is true for an open appeal marked finished', () => {
    expect(
      isVerdictAppealOutcomeShown({
        appealState: AppealCaseState.APPEALED,
        verdictAppealStatus: VerdictAppealStatus.COMPLETED,
      }),
    ).toBe(true)
  })

  // A completed appeal has ended whatever its status was later moved to.
  it('is true for a completed appeal with another status', () => {
    expect(
      isVerdictAppealOutcomeShown({
        appealState: AppealCaseState.COMPLETED,
        verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
      }),
    ).toBe(true)
  })

  it('is false for an open appeal with another status', () => {
    expect(
      isVerdictAppealOutcomeShown({
        appealState: AppealCaseState.APPEALED,
        verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
      }),
    ).toBe(false)
  })

  it('is false for an open appeal with no status', () => {
    expect(
      isVerdictAppealOutcomeShown({
        appealState: AppealCaseState.APPEALED,
        verdictAppealStatus: null,
      }),
    ).toBe(false)
  })

  it.each([null, undefined])('is false without an appeal (%s)', (appeal) => {
    expect(isVerdictAppealOutcomeShown(appeal)).toBe(false)
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

describe('isSameVerdictAppealRulingDate', () => {
  const picked = new Date('2024-01-10T00:00:00.000Z')

  it('is true for the date on record', () => {
    expect(
      isSameVerdictAppealRulingDate('2024-01-10T00:00:00.000Z', picked),
    ).toBe(true)
  })

  it('is false for another date', () => {
    expect(
      isSameVerdictAppealRulingDate('2024-01-09T00:00:00.000Z', picked),
    ).toBe(false)
  })

  it('is false when no date is on record', () => {
    expect(isSameVerdictAppealRulingDate(null, picked)).toBe(false)
    expect(isSameVerdictAppealRulingDate(undefined, picked)).toBe(false)
  })
})

describe('getVerdictAppealRulingDateMinDate', () => {
  it('is the start of the day of the verdict', () => {
    expect(
      getVerdictAppealRulingDateMinDate({
        rulingDate: new Date(2026, 4, 20, 14, 30).toISOString(),
        created: new Date(2026, 0, 2).toISOString(),
      }),
    ).toEqual(new Date(2026, 4, 20))
  })

  it('falls back to the day the case was created', () => {
    expect(
      getVerdictAppealRulingDateMinDate({
        rulingDate: null,
        created: new Date(2026, 0, 2, 9, 0).toISOString(),
      }),
    ).toEqual(new Date(2026, 0, 2))
  })

  it('is undefined without either', () => {
    expect(
      getVerdictAppealRulingDateMinDate({ rulingDate: null, created: '' }),
    ).toBeUndefined()
  })
})

describe('isVerdictAppealRulingDateInRange', () => {
  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const tomorrow = new Date(startOfToday)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = new Date(startOfToday)
  minDate.setDate(minDate.getDate() - 30)
  const dayBeforeMin = new Date(minDate)
  dayBeforeMin.setDate(dayBeforeMin.getDate() - 1)

  it.each([
    ['today', startOfToday],
    ['the earliest day', minDate],
  ])('accepts %s', (_, date) => {
    expect(isVerdictAppealRulingDateInRange(date, minDate, now)).toBe(true)
  })

  it.each([
    ['tomorrow', tomorrow],
    ['the day before the earliest day', dayBeforeMin],
    ['a half-typed year', new Date(202, 10, 25)],
    ['an invalid date', new Date('not a date')],
  ])('refuses %s', (_, date) => {
    expect(isVerdictAppealRulingDateInRange(date, minDate, now)).toBe(false)
  })

  it('refuses every date without a lower bound', () => {
    expect(isVerdictAppealRulingDateInRange(startOfToday, undefined, now)).toBe(
      false,
    )
  })
})
