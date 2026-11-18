import { firstValueFrom, of } from 'rxjs'
import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealEventType,
  AppealRulingType,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  DefendantEventType,
  getIndictmentAppealDeadline,
  InstitutionType,
  StringType,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system/types'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  CaseRepositoryService,
  Defendant,
  DefendantEventLog,
} from '../../../repository'
import { CaseInterceptor, transformDefendants } from '../case.interceptor'

const nationalId = '0101010101'
const otherNationalId = '0202020202'

const dismissedAt = new Date('2024-01-10')
const cancelledAt = new Date('2024-01-20')

const makeEventLog = (
  eventType: DefendantEventType,
  created: Date,
): DefendantEventLog => ({ eventType, created } as unknown as DefendantEventLog)

const makeDefendant = (
  defenderNationalId: string | undefined,
  eventLogs: DefendantEventLog[] = [],
) => ({
  toJSON: () => ({ defenderNationalId }),
  isDefenderChoiceConfirmed: true,
  defenderNationalId,
  eventLogs,
  verdicts: undefined,
  isSentToPrisonAdmin: false,
})

const makeCase = (
  defendants: ReturnType<typeof makeDefendant>[],
  type: CaseType = CaseType.INDICTMENT,
) => ({
  toJSON: () => ({}),
  type,
  defendants,
  caseFiles: undefined,
  prosecutor: undefined,
  civilClaimants: undefined,
  caseStrings: undefined,
  eventLogs: undefined,
  indictmentRulingDecision: undefined,
  rulingDate: undefined,
  parentCase: undefined,
  childCase: undefined,
  mergeCase: undefined,
  mergedCases: undefined,
  splitCase: undefined,
  splitCases: undefined,
  rulingModifiedHistory: undefined,
})

describe('transformDefendants - indictmentCancelledOrDismissedState', () => {
  describe('when defendant has no dismissal or cancellation event', () => {
    it('is undefined', () => {
      const result = transformDefendants({
        defendants: [makeDefendant(nationalId, [])] as unknown as Defendant[],
      })

      expect(result?.[0].indictmentCancelledOrDismissedState).toBeUndefined()
    })
  })

  describe('when defendant has an INDICTMENT_DISMISSED event', () => {
    it('sets type to DISMISSAL and includes the event time', () => {
      const result = transformDefendants({
        defendants: [
          makeDefendant(nationalId, [
            makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
          ]),
        ] as unknown as Defendant[],
      })

      expect(result?.[0].indictmentCancelledOrDismissedState).toEqual({
        type: CaseIndictmentRulingDecision.DISMISSAL,
        time: dismissedAt,
      })
    })
  })

  describe('when defendant has an INDICTMENT_CANCELLED event', () => {
    it('sets type to CANCELLATION and includes the event time', () => {
      const result = transformDefendants({
        defendants: [
          makeDefendant(nationalId, [
            makeEventLog(DefendantEventType.INDICTMENT_CANCELLED, cancelledAt),
          ]),
        ] as unknown as Defendant[],
      })

      expect(result?.[0].indictmentCancelledOrDismissedState).toEqual({
        type: CaseIndictmentRulingDecision.CANCELLATION,
        time: cancelledAt,
      })
    })
  })
})

describe('CaseInterceptor - getDefenceUserDefendants', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  interface Then {
    result: {
      defendants: {
        defenderNationalId: string
        verdictAppealDeadline?: Date
      }[]
      indictmentAppealDeadline?: Date
    }
    error: Error
  }

  type GivenWhenThen = (theCase: ReturnType<typeof makeCase>) => Promise<Then>

  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new CaseInterceptor({
        findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result as Then['result']))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when the user is not a defence user', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        makeDefendant(nationalId),
        makeDefendant(otherNationalId),
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.PROSECUTOR, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns all defendants', () => {
      expect(then.result.defendants).toHaveLength(2)
    })
  })

  describe('when the defence user has no confirmed defendants in the case', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([makeDefendant(otherNationalId)])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns all defendants', () => {
      expect(then.result.defendants).toHaveLength(1)
      expect(then.result.defendants[0].defenderNationalId).toBe(otherNationalId)
    })
  })

  describe('when the defence user is only confirmed as an appeal advocate', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        {
          ...makeDefendant(undefined),
          id: 'own_defendant',
          isDefenderChoiceConfirmed: false,
          isAppealDefenderConfirmed: true,
          isAppealDefenderWaived: false,
          appealDefenderNationalId: nationalId,
          toJSON: () => ({
            id: 'own_defendant',
            appealDefenderNationalId: nationalId,
          }),
        },
        {
          ...makeDefendant(otherNationalId),
          id: 'other_defendant',
          toJSON: () => ({
            id: 'other_defendant',
            defenderNationalId: otherNationalId,
          }),
        },
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns only the appeal-confirmed defendant', () => {
      expect(then.result.defendants).toHaveLength(1)
      expect(then.result.defendants[0]).toMatchObject({
        id: 'own_defendant',
        appealDefenderNationalId: nationalId,
      })
    })
  })

  describe('when the defence user has one district and one appeal defendant', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        {
          ...makeDefendant(nationalId, [
            makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
          ]),
          id: 'district_defendant',
          toJSON: () => ({
            id: 'district_defendant',
            defenderNationalId: nationalId,
          }),
        },
        {
          ...makeDefendant(undefined),
          id: 'appeal_defendant',
          isDefenderChoiceConfirmed: false,
          isAppealDefenderConfirmed: true,
          isAppealDefenderWaived: false,
          appealDefenderNationalId: nationalId,
          toJSON: () => ({
            id: 'appeal_defendant',
            appealDefenderNationalId: nationalId,
          }),
        },
        {
          ...makeDefendant(otherNationalId),
          id: 'other_defendant',
          toJSON: () => ({
            id: 'other_defendant',
            defenderNationalId: otherNationalId,
          }),
        },
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns both represented defendants and excludes co-defendants', () => {
      expect(then.result.defendants).toHaveLength(2)
      expect(then.result.defendants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'district_defendant' }),
          expect.objectContaining({
            id: 'appeal_defendant',
            appealDefenderNationalId: nationalId,
          }),
        ]),
      )
      expect(then.result.defendants).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'other_defendant' }),
        ]),
      )
    })

    it('does not complete the case from the district dismissal alone', () => {
      expect(then.result).not.toMatchObject({ state: CaseState.COMPLETED })
    })
  })

  describe('when the defence user has confirmed defendants but none are dismissed or cancelled', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        makeDefendant(nationalId, []),
        makeDefendant(otherNationalId, []),
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns all defendants', () => {
      expect(then.result.defendants).toHaveLength(2)
    })
  })

  describe('when the defence user has two defendants but only one is dismissed', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        makeDefendant(nationalId, []),
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns all defendants', () => {
      expect(then.result.defendants).toHaveLength(2)
    })
  })

  describe("when all of the defence user's defendants are dismissed or cancelled", () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        makeDefendant(otherNationalId, []), // another defender's active defendant
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it("returns only the defence user's defendants", () => {
      expect(then.result.defendants).toHaveLength(1)
      expect(then.result.defendants[0].defenderNationalId).toBe(nationalId)
    })
  })

  describe('when the defence user represents multiple defendants and all are dismissed or cancelled', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase([
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_CANCELLED, cancelledAt),
        ]),
        makeDefendant(otherNationalId, []), // another defender's active defendant
      ])

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it("returns only the defence user's defendants", () => {
      expect(then.result.defendants).toHaveLength(2)
      expect(
        then.result.defendants.every(
          (d) => d.defenderNationalId === nationalId,
        ),
      ).toBe(true)
    })
  })

  describe('request case — defence user assigned to one of multiple defendants', () => {
    let then: Then

    beforeEach(async () => {
      const assignedDefendant = {
        ...makeDefendant(nationalId),
        // R-cases leave choice/confirmed null (no indictment confirm workflow)
        isDefenderChoiceConfirmed: undefined,
      }
      const otherDefendant = {
        ...makeDefendant(otherNationalId),
        isDefenderChoiceConfirmed: undefined,
      }
      const theCase = makeCase(
        [assignedDefendant, otherDefendant],
        CaseType.CUSTODY,
      )

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('returns all defendants — request hearings cover the whole case', () => {
      expect(then.result.defendants).toHaveLength(2)
      expect(then.result.defendants.map((d) => d.defenderNationalId)).toEqual([
        nationalId,
        otherNationalId,
      ])
    })
  })

  describe('request case — defence user with no matching defendant defenderNationalId', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = makeCase(
        [
          {
            ...makeDefendant(otherNationalId),
            isDefenderChoiceConfirmed: undefined,
          },
        ],
        CaseType.TRAVEL_BAN,
      )

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('still returns all defendants', () => {
      expect(then.result.defendants).toHaveLength(1)
      expect(then.result.defendants[0].defenderNationalId).toBe(otherNationalId)
    })
  })

  describe('when a cancelled defendant belongs to a case with a ruling date', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = {
        ...makeCase([
          makeDefendant(nationalId, [
            makeEventLog(DefendantEventType.INDICTMENT_CANCELLED, cancelledAt),
          ]),
          makeDefendant(otherNationalId, []), // another defender's active defendant
        ]),
        // A ruling date the defence user is never presented with, since the
        // case is presented to them as completed on the cancellation date
        rulingDate: new Date('2024-03-01'),
      }

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen(theCase)
    })

    it('counts the defendant appeal deadline from the cancellation date', () => {
      const { deadlineDate } = getIndictmentAppealDeadline({
        baseDate: cancelledAt,
      })

      expect(then.result.defendants[0].verdictAppealDeadline).toStrictEqual(
        deadlineDate,
      )
    })

    it('matches the case level indictment appeal deadline', () => {
      expect(then.result.defendants[0].verdictAppealDeadline).toStrictEqual(
        then.result.indictmentAppealDeadline,
      )
    })
  })
})

describe('CaseInterceptor - reopenReason mapping', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  interface Then {
    result: { reopenReason?: string }
    error: Error
  }

  let givenWhenThen: () => Promise<Then>

  beforeEach(() => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new CaseInterceptor({
        findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result as Then['result']))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when caseStrings contains a REOPEN_REASON entry', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = {
        ...makeCase([]),
        caseStrings: [
          { stringType: StringType.REOPEN_REASON, value: 'the reopen reason' },
        ],
      }

      mockRequest.mockImplementationOnce(() => ({
        user: {
          currentUser: { role: UserRole.DISTRICT_COURT_JUDGE, nationalId },
        },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen()
    })

    it('includes the reopenReason in the response', () => {
      expect(then.result.reopenReason).toBe('the reopen reason')
    })
  })

  describe('when caseStrings is undefined', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        user: {
          currentUser: { role: UserRole.DISTRICT_COURT_JUDGE, nationalId },
        },
      }))
      mockHandle.mockReturnValueOnce(of(makeCase([])))

      then = await givenWhenThen()
    })

    it('returns undefined for reopenReason', () => {
      expect(then.result.reopenReason).toBeUndefined()
    })
  })
})

describe('CaseInterceptor - indictmentReviewReturnedExplanation mapping', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  interface Then {
    result: { indictmentReviewReturnedExplanation?: string }
    error: Error
  }

  let givenWhenThen: () => Promise<Then>

  beforeEach(() => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new CaseInterceptor({
        findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result as Then['result']))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when caseStrings contains an INDICTMENT_REVIEW_RETURNED_EXPLANATION entry', () => {
    let then: Then

    beforeEach(async () => {
      const theCase = {
        ...makeCase([]),
        caseStrings: [
          {
            stringType: StringType.INDICTMENT_REVIEW_RETURNED_EXPLANATION,
            value: 'needs changes',
          },
        ],
      }

      mockRequest.mockImplementationOnce(() => ({
        user: {
          currentUser: { role: UserRole.PROSECUTOR, nationalId },
        },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen()
    })

    it('includes the indictmentReviewReturnedExplanation in the response', () => {
      expect(then.result.indictmentReviewReturnedExplanation).toBe(
        'needs changes',
      )
    })
  })

  describe('when caseStrings is undefined', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        user: {
          currentUser: { role: UserRole.PROSECUTOR, nationalId },
        },
      }))
      mockHandle.mockReturnValueOnce(of(makeCase([])))

      then = await givenWhenThen()
    })

    it('returns undefined for indictmentReviewReturnedExplanation', () => {
      expect(then.result.indictmentReviewReturnedExplanation).toBeUndefined()
    })
  })
})

describe('CaseInterceptor - rulingModifiedHistory', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  const rulingModifiedHistory = 'the ruling was corrected'

  interface Then {
    result: { rulingModifiedHistory?: string }
    error: Error
  }

  let givenWhenThen: (caseType: CaseType, currentUser: unknown) => Promise<Then>

  beforeEach(() => {
    givenWhenThen = async (caseType, currentUser): Promise<Then> => {
      const interceptor = new CaseInterceptor({
        findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser },
      }))
      mockHandle.mockReturnValueOnce(
        of({ ...makeCase([]), type: caseType, rulingModifiedHistory }),
      )

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result as Then['result']))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when the user is a defence user in a request case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(CaseType.CUSTODY, {
        role: UserRole.DEFENDER,
        nationalId,
      })
    })

    it('includes the rulingModifiedHistory in the response', () => {
      expect(then.result.rulingModifiedHistory).toBe(rulingModifiedHistory)
    })
  })

  describe('when the user is a defence user in an indictment case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(CaseType.INDICTMENT, {
        role: UserRole.DEFENDER,
        nationalId,
      })
    })

    it('includes the rulingModifiedHistory in the response', () => {
      expect(then.result.rulingModifiedHistory).toBe(rulingModifiedHistory)
    })
  })

  describe('when the user is a prison system user in a request case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(CaseType.CUSTODY, {
        role: UserRole.PRISON_SYSTEM_STAFF,
        nationalId,
        institution: { type: InstitutionType.PRISON },
      })
    })

    it('returns undefined for rulingModifiedHistory', () => {
      expect(then.result.rulingModifiedHistory).toBeUndefined()
    })
  })
})

describe('CaseInterceptor - appeal ruling', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  const appealRuling = {
    appealRulingDecision: AppealCaseRulingDecision.CHANGED,
    appealConclusion: 'the appealed ruling is changed',
    appealRulingModifiedHistory: 'the appeal ruling was corrected',
    appealValidToDate: new Date('2024-02-01'),
    isAppealCustodyIsolation: true,
    appealIsolationToDate: new Date('2024-01-25'),
  }
  const withheldAppealRuling = {
    appealRulingDecision: undefined,
    appealConclusion: undefined,
    appealRulingModifiedHistory: undefined,
    appealValidToDate: undefined,
    isAppealCustodyIsolation: undefined,
    appealIsolationToDate: undefined,
  }

  const makeAppealCase = (id: string, appealState: AppealCaseState) => {
    const appealCase = {
      id,
      appealState,
      appealCaseNumber: '1/2024',
      ...appealRuling,
    }

    return {
      ...appealCase,
      toJSON: () => appealCase,
      appealEventLogs: undefined,
    }
  }

  type AppealCaseResult = Partial<typeof appealRuling> & {
    id: string
    appealState: AppealCaseState
    appealCaseNumber: string
  }

  interface Then {
    result: {
      appealCase: AppealCaseResult
      rulingOrderAppealCases: AppealCaseResult[]
    }
    error: Error
  }

  let givenWhenThen: (
    appealState: AppealCaseState,
    currentUser: unknown,
  ) => Promise<Then>

  beforeEach(() => {
    givenWhenThen = async (appealState, currentUser): Promise<Then> => {
      const interceptor = new CaseInterceptor({
        findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser },
      }))
      mockHandle.mockReturnValueOnce(
        of({
          ...makeCase([]),
          appealCase: makeAppealCase('case_level_appeal', appealState),
          rulingOrderAppealCases: [
            makeAppealCase('ruling_order_appeal', appealState),
            makeAppealCase(
              'completed_ruling_order_appeal',
              AppealCaseState.COMPLETED,
            ),
          ],
        }),
      )

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result as Then['result']))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([
    AppealCaseState.APPEALED,
    AppealCaseState.RECEIVED,
    AppealCaseState.WITHDRAWN,
  ])(
    'when the user is a defence user and the appeal case is %s',
    (appealState) => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(appealState, {
          role: UserRole.DEFENDER,
          nationalId,
        })
      })

      it('withholds the ruling of the case level appeal', () => {
        expect(then.result.appealCase).toMatchObject(withheldAppealRuling)
      })

      it('withholds the ruling of the ruling order appeal', () => {
        expect(then.result.rulingOrderAppealCases[0]).toMatchObject(
          withheldAppealRuling,
        )
      })

      it('includes the ruling of a completed ruling order appeal', () => {
        expect(then.result.rulingOrderAppealCases[1]).toMatchObject(
          appealRuling,
        )
      })

      it('includes the rest of the appeal cases', () => {
        expect(then.result.appealCase).toMatchObject({
          id: 'case_level_appeal',
          appealState,
          appealCaseNumber: '1/2024',
        })
        expect(then.result.rulingOrderAppealCases[0]).toMatchObject({
          id: 'ruling_order_appeal',
          appealState,
          appealCaseNumber: '1/2024',
        })
      })
    },
  )

  describe('when the user is a defence user and the appeal case is completed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(AppealCaseState.COMPLETED, {
        role: UserRole.DEFENDER,
        nationalId,
      })
    })

    it('includes the ruling of the case level appeal', () => {
      expect(then.result.appealCase).toMatchObject(appealRuling)
    })

    it('includes the ruling of the ruling order appeal', () => {
      expect(then.result.rulingOrderAppealCases[0]).toMatchObject(appealRuling)
    })
  })

  describe.each([
    [
      'a prosecution user',
      {
        role: UserRole.PROSECUTOR,
        nationalId,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      },
    ],
    [
      'a prison system user',
      {
        role: UserRole.PRISON_SYSTEM_STAFF,
        nationalId,
        institution: { type: InstitutionType.PRISON },
      },
    ],
    [
      'a court of appeals user',
      {
        role: UserRole.COURT_OF_APPEALS_JUDGE,
        nationalId,
        institution: { type: InstitutionType.COURT_OF_APPEALS },
      },
    ],
  ])(
    'when the user is %s and the appeal case is not completed',
    (_, currentUser) => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(AppealCaseState.RECEIVED, currentUser)
      })

      it('includes the ruling of the case level appeal', () => {
        expect(then.result.appealCase).toMatchObject(appealRuling)
      })

      it('includes the ruling of the ruling order appeal', () => {
        expect(then.result.rulingOrderAppealCases[0]).toMatchObject(
          appealRuling,
        )
      })
    },
  )
})

describe('CaseInterceptor - verdict appeal outcome', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  const outcome = {
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'the appealed judgment stands',
    appealRulingModifiedHistory: 'the judgment was corrected',
    appealRulingDate: new Date('2024-03-01'),
  }
  const withheldOutcome = {
    appealRulingDecision: undefined,
    appealRulingType: undefined,
    appealConclusion: undefined,
    appealRulingModifiedHistory: undefined,
    appealRulingDate: undefined,
  }

  const makeFile = (id: string, category: CaseFileCategory) => {
    const file = { id, category, state: CaseFileState.STORED_IN_RVG }

    return { ...file, toJSON: () => file }
  }

  const courtOfAppealsUser = {
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    nationalId,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  }

  interface Then {
    result: {
      verdictAppealCase: Partial<typeof outcome> & {
        id: string
        appealState: AppealCaseState
        appealCaseNumber: string
        verdictAppealStatus: VerdictAppealStatus
        statementDeadlines?: { id: string }[]
      }
      caseFiles: { id: string }[]
    }
  }

  const givenWhenThen = async (
    appealState: AppealCaseState,
    currentUser: unknown,
  ): Promise<Then> => {
    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (theCase) => Promise.resolve(theCase.id),
    } as unknown as CaseRepositoryService)
    const prosecutionDeadline = {
      id: 'prosecution_deadline',
      deadline: new Date('2026-09-14T00:00:00.000Z'),
      toJSON() {
        return {
          id: 'prosecution_deadline',
          deadline: new Date('2026-09-14T00:00:00.000Z'),
        }
      },
    }
    const verdictAppealCase = {
      id: 'verdict_appeal',
      appealState,
      appealCaseNumber: '2/2024',
      verdictAppealStatus: VerdictAppealStatus.COMPLETED,
      statementDeadlines: [prosecutionDeadline],
      ...outcome,
    }

    mockRequest.mockImplementationOnce(() => ({ user: { currentUser } }))
    mockHandle.mockReturnValueOnce(
      of({
        ...makeCase([]),
        verdictAppealCase: {
          ...verdictAppealCase,
          toJSON: () => verdictAppealCase,
        },
        caseFiles: [
          makeFile('district_ruling', CaseFileCategory.RULING),
          makeFile(
            'verdict_appeal_ruling',
            CaseFileCategory.VERDICT_APPEAL_RULING,
          ),
        ],
      }),
    )

    const result = await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )

    return { result: result as Then['result'] }
  }

  describe.each([
    [
      'a prosecution user',
      {
        role: UserRole.PROSECUTOR,
        nationalId,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      },
    ],
    [
      'a public prosecution office user',
      {
        role: UserRole.PUBLIC_PROSECUTOR_STAFF,
        nationalId,
        institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
      },
    ],
    [
      'a district court user',
      {
        role: UserRole.DISTRICT_COURT_JUDGE,
        nationalId,
        institution: { type: InstitutionType.DISTRICT_COURT },
      },
    ],
    ['a defence user', { role: UserRole.DEFENDER, nationalId }],
    [
      'a prison system user',
      {
        role: UserRole.PRISON_SYSTEM_STAFF,
        nationalId,
        institution: { type: InstitutionType.PRISON },
      },
    ],
  ])('when the user is %s', (_, currentUser) => {
    describe.each([AppealCaseState.APPEALED, AppealCaseState.COMPLETED])(
      'and the verdict appeal is %s',
      (appealState) => {
        let then: Then

        beforeEach(async () => {
          then = await givenWhenThen(appealState, currentUser)
        })

        it('withholds the outcome', () => {
          expect(then.result.verdictAppealCase).toMatchObject(withheldOutcome)
        })

        it('presents the appeal as in progress', () => {
          expect(then.result.verdictAppealCase).toMatchObject({
            id: 'verdict_appeal',
            appealState: AppealCaseState.APPEALED,
            appealCaseNumber: '2/2024',
          })
        })

        it('presents a recorded status of completed as under advisement', () => {
          expect(then.result.verdictAppealCase.verdictAppealStatus).toBe(
            VerdictAppealStatus.UNDER_ADVISEMENT,
          )
        })

        it('strips statement deadlines when the completed appeal is masked', () => {
          if (appealState !== AppealCaseState.COMPLETED) {
            return
          }

          expect(
            then.result.verdictAppealCase.statementDeadlines,
          ).toBeUndefined()
        })

        it('leaves the court of appeals ruling out of the case files', () => {
          expect(then.result.caseFiles.map((file) => file.id)).toEqual([
            'district_ruling',
          ])
        })
      },
    )

    it('still presents a withdrawn appeal as withdrawn', async () => {
      const then = await givenWhenThen(AppealCaseState.WITHDRAWN, currentUser)

      expect(then.result.verdictAppealCase.appealState).toBe(
        AppealCaseState.WITHDRAWN,
      )
    })
  })

  describe.each([AppealCaseState.APPEALED, AppealCaseState.COMPLETED])(
    'when the user is a court of appeals user and the verdict appeal is %s',
    (appealState) => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(appealState, courtOfAppealsUser)
      })

      it('includes the outcome and the state', () => {
        expect(then.result.verdictAppealCase).toMatchObject({
          ...outcome,
          appealState,
          verdictAppealStatus: VerdictAppealStatus.COMPLETED,
        })
      })

      it('keeps statement deadlines for the court of appeals', () => {
        expect(then.result.verdictAppealCase.statementDeadlines).toEqual([
          expect.objectContaining({ id: 'prosecution_deadline' }),
        ])
      })

      it('includes the court of appeals ruling in the case files', () => {
        expect(then.result.caseFiles.map((file) => file.id)).toEqual([
          'district_ruling',
          'verdict_appeal_ruling',
        ])
      })
    },
  )
})

// The interceptor runs after the handler and before the global commit
// interceptor, so on a route whose guard locked the case row the request
// transaction is still open and holding that lock. The ancestor read has to
// join it: outside it, it needs a pool connection that concurrent updates of
// the same case, blocked on the lock, are holding.
describe('CaseInterceptor - original ancestor read', () => {
  const mockFindOriginalAncestorId = jest.fn()
  const theCase = makeCase([]) as unknown as Case
  const originalAncestorId = 'original-ancestor-id'

  const intercept = async () => {
    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: mockFindOriginalAncestorId,
    } as unknown as CaseRepositoryService)

    return firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({
            getRequest: () => ({
              user: { currentUser: { role: UserRole.PROSECUTOR, nationalId } },
            }),
          }),
        } as unknown as ExecutionContext,
        { handle: () => of(theCase) } as unknown as CallHandler,
      ),
    ) as Promise<{ originalAncestorId?: string }>
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFindOriginalAncestorId.mockResolvedValue(originalAncestorId)
  })

  it('reads outside a transaction on a route that opened none', async () => {
    const result = await runInRequestContext(intercept)

    expect(mockFindOriginalAncestorId).toHaveBeenCalledWith(theCase, {
      transaction: undefined,
    })
    expect(result.originalAncestorId).toBe(originalAncestorId)
  })

  it('reads in the request transaction without opening another', async () => {
    const transaction = {} as Transaction
    const sequelize = {
      transaction: jest.fn().mockResolvedValue(transaction),
    } as unknown as Sequelize

    // The guard that locked the case row opened the request transaction
    // before the handler ran; guards do not run here, so it is set up by hand.
    const result = await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      return intercept()
    })

    expect(mockFindOriginalAncestorId).toHaveBeenCalledWith(theCase, {
      transaction,
    })
    expect(sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(result.originalAncestorId).toBe(originalAncestorId)
  })
})

describe('CaseInterceptor - verdictAppealCase party filter', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()

  const makeDeadline = (fields: {
    id: string
    defendantId?: string
    deadline: Date
  }) => ({
    ...fields,
    toJSON: () => ({ ...fields }),
  })

  const ownDeadline = makeDeadline({
    id: 'own_deadline',
    defendantId: 'own_defendant',
    deadline: new Date('2026-11-15'),
  })
  const otherDeadline = makeDeadline({
    id: 'other_deadline',
    defendantId: 'other_defendant',
    deadline: new Date('2026-11-20'),
  })
  const prosecutionDeadline = makeDeadline({
    id: 'prosecution_deadline',
    deadline: new Date('2026-11-18'),
  })
  const ownEvent = {
    id: 'own_event',
    defendantId: 'own_defendant',
    eventType: AppealEventType.APPEAL_STATEMENT_SENT,
  }
  const otherStatementEvent = {
    id: 'other_statement_event',
    defendantId: 'other_defendant',
    eventType: AppealEventType.APPEAL_STATEMENT_SENT,
  }
  const prosecutionStatementEvent = {
    id: 'prosecution_statement_event',
    eventType: AppealEventType.APPEAL_STATEMENT_SENT,
    userRole: UserRole.PROSECUTOR,
  }
  const coDefendantProsecutionAppeal = {
    id: 'co_defendant_prosecution_appeal',
    defendantId: 'other_defendant',
    eventType: AppealEventType.APPEALED,
    userRole: UserRole.PROSECUTOR,
  }

  const draftRulingFields = {
    appealCaseNumber: '1/2026',
    appealConclusion: 'Draft Landsréttur conclusion',
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingDate: new Date('2026-12-01T12:00:00.000Z'),
  }

  const makeVerdictAppealCase = (
    appealState: AppealCaseState = AppealCaseState.RECEIVED,
  ) => {
    const statementDeadlines = [ownDeadline, otherDeadline, prosecutionDeadline]
    const appealEventLogs = [
      ownEvent,
      otherStatementEvent,
      prosecutionStatementEvent,
      coDefendantProsecutionAppeal,
    ]

    return {
      toJSON: () => ({
        id: 'verdict_appeal_case_id',
        appealState,
        ...draftRulingFields,
        statementDeadlines,
        appealEventLogs,
      }),
      id: 'verdict_appeal_case_id',
      appealState,
      ...draftRulingFields,
      statementDeadlines,
      appealEventLogs,
    }
  }

  const makeIndictmentWithVerdictAppeal = (appealState?: AppealCaseState) => {
    const base = makeCase([
      {
        ...makeDefendant(nationalId),
        id: 'own_defendant',
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: nationalId,
      },
      {
        ...makeDefendant(otherNationalId),
        id: 'other_defendant',
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: otherNationalId,
      },
    ])
    const verdictAppealCase = makeVerdictAppealCase(appealState)

    return {
      ...base,
      // Non-defence keeps this nested payload from toJSON(); defence rewrites
      // it in transformVerdictAppealCaseForUser.
      toJSON: () => ({
        ...base.toJSON(),
        verdictAppealCase: verdictAppealCase.toJSON(),
      }),
      verdictAppealCase,
    }
  }

  beforeEach(() => {
    mockRequest.mockReset()
    mockHandle.mockReset()
  })

  it('keeps own-party rows, co-defendant statement filings, and prosecution appeal events', async () => {
    const theCase = makeIndictmentWithVerdictAppeal()
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        statementDeadlines: { id: string }[]
        appealEventLogs: { id: string }[]
      }
    }

    expect(
      result.verdictAppealCase.statementDeadlines.map((d) => d.id),
    ).toEqual(['own_deadline'])
    expect(result.verdictAppealCase.appealEventLogs.map((e) => e.id)).toEqual([
      'own_event',
      'other_statement_event',
      'prosecution_statement_event',
      'co_defendant_prosecution_appeal',
    ])
    // Co-party / unscoped prosecution SENT rows are filing-status only.
    expect(
      result.verdictAppealCase.appealEventLogs.find(
        (e) => e.id === 'other_statement_event',
      ),
    ).toEqual({
      id: 'other_statement_event',
      eventType: AppealEventType.APPEAL_STATEMENT_SENT,
      defendantId: 'other_defendant',
      created: undefined,
      userRole: undefined,
      civilClaimantId: undefined,
    })
    expect(
      result.verdictAppealCase.appealEventLogs.find(
        (e) => e.id === 'prosecution_statement_event',
      ),
    ).toEqual({
      id: 'prosecution_statement_event',
      eventType: AppealEventType.APPEAL_STATEMENT_SENT,
      userRole: UserRole.PROSECUTOR,
      created: undefined,
      defendantId: undefined,
      civilClaimantId: undefined,
    })
  })

  it('leaves verdict-appeal deadlines unfiltered for non-defence users', async () => {
    const theCase = makeIndictmentWithVerdictAppeal()
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.PROSECUTOR, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        statementDeadlines: { id: string }[]
        appealEventLogs: { id: string }[]
      }
    }

    expect(
      result.verdictAppealCase.statementDeadlines.map((d) => d.id),
    ).toEqual(['own_deadline', 'other_deadline', 'prosecution_deadline'])
    expect(result.verdictAppealCase.appealEventLogs.map((e) => e.id)).toEqual([
      'own_event',
      'other_statement_event',
      'prosecution_statement_event',
      'co_defendant_prosecution_appeal',
    ])
  })

  it('withholds draft Landsréttur ruling fields from defence users', async () => {
    const theCase = makeIndictmentWithVerdictAppeal(AppealCaseState.RECEIVED)
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        appealCaseNumber?: string
        appealConclusion?: string
        appealRulingDecision?: AppealCaseRulingDecision
        appealRulingDate?: Date
      }
    }

    expect(result.verdictAppealCase.appealCaseNumber).toBe(
      draftRulingFields.appealCaseNumber,
    )
    expect(result.verdictAppealCase.appealConclusion).toBeUndefined()
    expect(result.verdictAppealCase.appealRulingDecision).toBeUndefined()
    expect(result.verdictAppealCase.appealRulingDate).toBeUndefined()
  })

  it('withholds Landsréttur ruling fields from defence users once completed', async () => {
    const theCase = makeIndictmentWithVerdictAppeal(AppealCaseState.COMPLETED)
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        appealConclusion?: string
        appealRulingDecision?: AppealCaseRulingDecision
        appealRulingDate?: Date
      }
    }

    expect(result.verdictAppealCase.appealConclusion).toBeUndefined()
    expect(result.verdictAppealCase.appealRulingDecision).toBeUndefined()
    expect(result.verdictAppealCase.appealRulingDate).toBeUndefined()
  })

  it('leaves draft Landsréttur ruling fields visible for court of appeals users', async () => {
    const theCase = makeIndictmentWithVerdictAppeal(AppealCaseState.RECEIVED)
    mockRequest.mockImplementationOnce(() => ({
      user: {
        currentUser: {
          role: UserRole.COURT_OF_APPEALS_ASSISTANT,
          nationalId,
          institution: { type: InstitutionType.COURT_OF_APPEALS },
        },
      },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        appealConclusion?: string
        appealRulingDecision?: AppealCaseRulingDecision
        appealRulingDate?: Date
      }
    }

    expect(result.verdictAppealCase.appealConclusion).toBe(
      draftRulingFields.appealConclusion,
    )
    expect(result.verdictAppealCase.appealRulingDecision).toBe(
      draftRulingFields.appealRulingDecision,
    )
    expect(result.verdictAppealCase.appealRulingDate).toEqual(
      draftRulingFields.appealRulingDate,
    )
  })

  it('marks each statement deadline as expired from the server clock', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-11-16T12:00:00.000Z').getTime())

    const theCase = makeIndictmentWithVerdictAppeal()
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        statementDeadlines: { id: string; isExpired?: boolean }[]
      }
    }

    expect(result.verdictAppealCase.statementDeadlines).toEqual([
      expect.objectContaining({ id: 'own_deadline', isExpired: true }),
    ])

    jest.restoreAllMocks()
  })

  it('serializes isExpired on every statement deadline for non-defence users', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-11-16T12:00:00.000Z').getTime())

    const theCase = makeIndictmentWithVerdictAppeal()
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.PROSECUTOR, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        statementDeadlines: { id: string; isExpired?: boolean }[]
      }
    }

    expect(result.verdictAppealCase.statementDeadlines).toEqual([
      expect.objectContaining({ id: 'own_deadline', isExpired: true }),
      expect.objectContaining({ id: 'other_deadline', isExpired: false }),
      expect.objectContaining({ id: 'prosecution_deadline', isExpired: false }),
    ])

    jest.restoreAllMocks()
  })

  it('keeps a midnight deadline open through the whole deadline day', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-11-15T12:00:00.000Z').getTime())

    const theCase = makeIndictmentWithVerdictAppeal()
    mockRequest.mockImplementationOnce(() => ({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
    }))
    mockHandle.mockReturnValueOnce(of(theCase))

    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = (await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext,
        { handle: mockHandle } as unknown as CallHandler,
      ),
    )) as {
      verdictAppealCase: {
        statementDeadlines: { id: string; isExpired?: boolean }[]
      }
    }

    // own_deadline is 2026-11-15T00:00:00.000Z — still open at noon that day.
    expect(result.verdictAppealCase.statementDeadlines).toEqual([
      expect.objectContaining({ id: 'own_deadline', isExpired: false }),
    ])

    jest.restoreAllMocks()
  })
})
