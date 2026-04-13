import { firstValueFrom, of } from 'rxjs'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  DefendantEventType,
  UserRole,
} from '@island.is/judicial-system/types'

import { DefendantEventLog } from '../../../repository'
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

const makeCase = (defendants: ReturnType<typeof makeDefendant>[]) => ({
  toJSON: () => ({}),
  type: CaseType.INDICTMENT,
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
        defendants: [makeDefendant(nationalId, [])] as any,
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
        ] as any,
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
        ] as any,
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
    result: { defendants: { defenderNationalId: string }[] }
    error: Error
  }

  type GivenWhenThen = (theCase: ReturnType<typeof makeCase>) => Promise<Then>

  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = async (theCase): Promise<Then> => {
      const interceptor = new CaseInterceptor()
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
})
