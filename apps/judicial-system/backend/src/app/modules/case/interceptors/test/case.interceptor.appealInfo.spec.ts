import each from 'jest-each'

import {
  AppealCaseState,
  CaseAppealDecision,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, Case, CaseFile } from '../../../repository'
import {
  getAppealCaseInfo,
  getIndictmentCaseLevelAppealInfo,
  getRequestCaseLevelAppealInfo,
  getRulingOrderAppealInfo,
} from '../case.interceptor'

describe('getRequestCaseLevelAppealInfo', () => {
  it('returns empty appeal info when no ruling date is provided', () => {
    const theCase = { type: CaseType.CUSTODY } as Case

    expect(getRequestCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns canBeAppealed when prosecutor and defender postponed their decisions', () => {
    const rulingDate = '2022-06-15T19:50:08.033Z'
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate,
      accusedAppealDecision: CaseAppealDecision.POSTPONE,
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toEqual({
      hasBeenAppealed: false,
      canBeAppealed: true,
      canDefenderAppeal: true,
      canProsecutorAppeal: true,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      isAppealDeadlineExpired: true,
    })
  })

  it('returns hasBeenAppealed when an appeal exists and the case was not accepted in court', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: '2022-06-15T19:50:08.033Z',
      accusedAppealDecision: CaseAppealDecision.APPEAL,
      prosecutorAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toEqual({
      hasBeenAppealed: true,
      canBeAppealed: false,
      canDefenderAppeal: false,
      canProsecutorAppeal: false,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      isAppealDeadlineExpired: true,
    })
  })

  it('treats both parties accepting in court as not appealed even when an appealCase exists', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: '2022-06-15T19:50:08.033Z',
      accusedAppealDecision: CaseAppealDecision.ACCEPT,
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: false,
    })
  })

  each([
    [CaseAppealDecision.POSTPONE, true],
    [CaseAppealDecision.NOT_APPLICABLE, true],
    [CaseAppealDecision.ACCEPT, false],
    [CaseAppealDecision.APPEAL, false],
  ]).it(
    'returns canProsecutorAppeal=%s when prosecutorAppealDecision=%s',
    (decision: CaseAppealDecision, expected: boolean) => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorAppealDecision: decision,
      } as Case

      const info = getRequestCaseLevelAppealInfo(theCase)

      expect(info.canProsecutorAppeal).toBe(expected)
    },
  )

  each([
    [CaseAppealDecision.POSTPONE, true],
    [CaseAppealDecision.NOT_APPLICABLE, true],
    [CaseAppealDecision.ACCEPT, false],
    [CaseAppealDecision.APPEAL, false],
  ]).it(
    'returns canDefenderAppeal=%s when accusedAppealDecision=%s',
    (decision: CaseAppealDecision, expected: boolean) => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        accusedAppealDecision: decision,
      } as Case

      const info = getRequestCaseLevelAppealInfo(theCase)

      expect(info.canDefenderAppeal).toBe(expected)
    },
  )
})

describe('getIndictmentCaseLevelAppealInfo', () => {
  it('returns empty appeal info when ruling decision is not DISMISSAL', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns empty appeal info when no ruling date', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns canBeAppealed when an indictment dismissal has not been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({
      hasBeenAppealed: false,
      canBeAppealed: true,
      canProsecutorAppeal: true,
      canDefenderAppeal: true,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      isAppealDeadlineExpired: true,
    })
  })

  it('returns hasBeenAppealed when an indictment dismissal has been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({
      hasBeenAppealed: true,
      canBeAppealed: false,
      canProsecutorAppeal: false,
      canDefenderAppeal: false,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      isAppealDeadlineExpired: true,
    })
  })

  it('returns isAppealDeadlineExpired=false when the deadline is in the future', () => {
    const rulingDate = new Date()
    rulingDate.setSeconds(rulingDate.getSeconds() + 100)
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: rulingDate.toISOString(),
    } as Case

    expect(
      getIndictmentCaseLevelAppealInfo(theCase).isAppealDeadlineExpired,
    ).toBe(false)
  })
})

describe('getAppealCaseInfo', () => {
  describe('case-level appeals (rulingFileId is null)', () => {
    it('attributes the appeal to the prosecutor when prosecutorPostponedAppealDate is set', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toEqual({
        appealedByRole: UserRole.PROSECUTOR,
        appealedDate: '2022-06-15T19:50:08.033Z',
        statementDeadline: undefined,
        isStatementDeadlineExpired: undefined,
      })
    })

    it('attributes the appeal to the defender when accusedPostponedAppealDate is set', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toEqual({
        appealedByRole: UserRole.DEFENDER,
        appealedDate: '2022-06-15T19:50:08.033Z',
        statementDeadline: undefined,
        isStatementDeadlineExpired: undefined,
      })
    })

    it('ignores postponed-appeal dates that match an in-court ACCEPT decision (request cases)', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        accusedAppealDecision: CaseAppealDecision.ACCEPT,
        prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: undefined,
        appealedDate: undefined,
      })
    })

    it('returns statement deadline + expired flag when the appeal has been received by the court', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      } as Case
      const appealCase = {
        appealReceivedByCourtDate: new Date('2022-06-17T12:00:00.000Z'),
      } as AppealCase

      const info = getAppealCaseInfo(appealCase, theCase)

      expect(info.statementDeadline).toBe('2022-06-18T12:00:00.000Z')
      expect(info.isStatementDeadlineExpired).toBe(true)
    })
  })

  describe('ruling-order appeals (rulingFileId is set)', () => {
    it('attributes the appeal to the defender when appealedByNationalId is set', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        appealedByNationalId: '0101011010',
        created: new Date('2026-04-01T12:00:00.000Z'),
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: UserRole.DEFENDER,
        appealedDate: '2026-04-01T12:00:00.000Z',
      })
    })

    it('attributes the appeal to the prosecutor when no appealedByNationalId is set', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        created: new Date('2026-04-01T12:00:00.000Z'),
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: UserRole.PROSECUTOR,
        appealedDate: '2026-04-01T12:00:00.000Z',
      })
    })

    it('uses appealReceivedByCourtDate for the statement deadline', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        appealReceivedByCourtDate: new Date('2026-04-02T12:00:00.000Z'),
        created: new Date('2026-04-01T12:00:00.000Z'),
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase).statementDeadline).toBe(
        '2026-04-03T12:00:00.000Z',
      )
    })
  })
})

describe('getRulingOrderAppealInfo', () => {
  it('returns empty info for non-ruling-order files', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
    } as CaseFile

    expect(getRulingOrderAppealInfo(caseFile, {} as Case)).toEqual({})
  })

  it('returns canBeAppealed true when no appeal exists and the case is not completed', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('2020-01-01T00:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
    } as unknown as Case

    const info = getRulingOrderAppealInfo(caseFile, theCase)

    expect(info).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: true,
      isAppealDeadlineExpired: true,
    })
    expect(info.appealDeadline).toBeDefined()
  })

  it('returns hasBeenAppealed true when an appeal exists for this ruling file', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('2026-04-01T12:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [{ rulingFileId: 'file-id' } as AppealCase],
    } as unknown as Case

    expect(getRulingOrderAppealInfo(caseFile, theCase)).toMatchObject({
      hasBeenAppealed: true,
      canBeAppealed: false,
    })
  })

  it('returns canBeAppealed false when the case is completed', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('2026-04-01T12:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.COMPLETED,
      rulingOrderAppealCases: [],
    } as unknown as Case

    expect(getRulingOrderAppealInfo(caseFile, theCase)).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: false,
    })
  })

  it('does not gate canBeAppealed by the soft deadline', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('1900-01-01T00:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
    } as unknown as Case

    const info = getRulingOrderAppealInfo(caseFile, theCase)

    expect(info.isAppealDeadlineExpired).toBe(true)
    expect(info.canBeAppealed).toBe(true)
  })
})
