import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import each from 'jest-each'
import { firstValueFrom, of } from 'rxjs'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { CaseInterceptor, getIndictmentInfo } from '../case.interceptor'

const nationalId = '0101010101'

const makeCase = (theCase: Partial<Case>) =>
  ({
    toJSON: () => ({ ...theCase }),
    defendants: undefined,
    caseFiles: undefined,
    prosecutor: undefined,
    civilClaimants: undefined,
    caseStrings: undefined,
    eventLogs: undefined,
    parentCase: undefined,
    childCase: undefined,
    mergeCase: undefined,
    mergedCases: undefined,
    splitCase: undefined,
    splitCases: undefined,
    ...theCase,
  } as unknown as Case)

const intercept = async (theCase: Case) => {
  const interceptor = new CaseInterceptor({
    findOriginalAncestorId: (aCase: Case) => Promise.resolve(aCase.id),
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
  )
}

const makeDefendant = (verdict?: {
  serviceDate?: Date
  serviceRequirement?: ServiceRequirement
}) =>
  ({
    verdicts: verdict ? [verdict] : undefined,
    eventLogs: undefined,
    toJSON: () => ({}),
  } as unknown as Defendant)

describe('CaseInterceptor - request case info', () => {
  each`
    originalValue | transformedValue
    ${null}       | ${false}
    ${false}      | ${false}
    ${true}       | ${true}
  `.describe(
    'when transforming boolean case attributes',
    ({ originalValue, transformedValue }) => {
      it(`should transform ${originalValue} requestProsecutorOnlySession to ${transformedValue}`, async () => {
        const theCase = makeCase({
          type: CaseType.CUSTODY,
          requestProsecutorOnlySession: originalValue,
        })

        const res = await intercept(theCase)

        expect(res.requestProsecutorOnlySession).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isClosedCourtHidden to ${transformedValue}`, async () => {
        const theCase = makeCase({
          type: CaseType.CUSTODY,
          isClosedCourtHidden: originalValue,
        })

        const res = await intercept(theCase)

        expect(res.isClosedCourtHidden).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isHeightenedSecurityLevel to ${transformedValue}`, async () => {
        const theCase = makeCase({
          type: CaseType.CUSTODY,
          isHeightenedSecurityLevel: originalValue,
        })

        const res = await intercept(theCase)

        expect(res.isHeightenedSecurityLevel).toBe(transformedValue)
      })
    },
  )

  describe('isValidToDateInThePast', () => {
    it('should not set custody end date in the past if no custody end date', async () => {
      const theCase = makeCase({ type: CaseType.CUSTODY })

      const res = await intercept(theCase)

      expect(res.isValidToDateInThePast).toBeUndefined()
    })

    it('should set custody end date in the past to false if custody end date in the future', async () => {
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() + 1)
      const theCase = makeCase({ type: CaseType.CUSTODY, validToDate })

      const res = await intercept(theCase)

      expect(res.isValidToDateInThePast).toBe(false)
    })

    it('should set custody end date in the past to true if custody end date in the past', async () => {
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() - 1)
      const theCase = makeCase({ type: CaseType.CUSTODY, validToDate })

      const res = await intercept(theCase)

      expect(res.isValidToDateInThePast).toBe(true)
    })
  })

  it('should not add indictment info to a request case', async () => {
    const theCase = makeCase({
      type: CaseType.CUSTODY,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
    })

    const res = await intercept(theCase)

    expect(res.indictmentAppealDeadline).toBeUndefined()
  })
})

describe('CaseInterceptor - indictment case info', () => {
  it('should add indictment info to an indictment case', async () => {
    const rulingDate = new Date('2022-06-15T19:50:08.033Z')
    const theCase = makeCase({
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    })

    const res = await intercept(theCase)

    expect(res.indictmentAppealDeadline).toStrictEqual(
      endOfDay(addDays(rulingDate, 28)),
    )
    expect(res.indictmentVerdictViewedByAll).toBe(true)
    expect(res.indictmentVerdictAppealDeadlineExpired).toBe(true)
  })

  it('should not add request case info to an indictment case', async () => {
    const theCase = makeCase({ type: CaseType.INDICTMENT })

    const res = await intercept(theCase)

    expect(res.requestProsecutorOnlySession).toBeUndefined()
    expect(res.isClosedCourtHidden).toBeUndefined()
    expect(res.isHeightenedSecurityLevel).toBeUndefined()
  })
})

describe('getIndictmentInfo', () => {
  it('should return empty indictment info when ruling date is not provided', () => {
    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    })

    expect(indictmentInfo).toEqual({})
  })

  it('should return correct indictment info when ruling date is provided', () => {
    const rulingDate = new Date('2022-06-15T19:50:08.033Z')

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: endOfDay(addDays(rulingDate, 28)),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when some defendants have yet to view the verdict', () => {
    const rulingDate = new Date('2022-06-14T19:50:08.033Z')
    const defendants = [
      makeDefendant({
        serviceDate: new Date('2022-06-15T19:50:08.033Z'),
        serviceRequirement: ServiceRequirement.REQUIRED,
      }),
      makeDefendant({
        serviceDate: undefined,
        serviceRequirement: ServiceRequirement.REQUIRED,
      }),
    ]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: endOfDay(addDays(rulingDate, 28)),
      indictmentVerdictViewedByAll: false,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when no defendants have yet to view the verdict', () => {
    const rulingDate = new Date('2022-06-14T19:50:08.033Z')
    const defendants = [
      makeDefendant({ serviceDate: new Date('2022-06-15T19:50:08.033Z') }),
      makeDefendant({
        serviceRequirement: ServiceRequirement.NOT_REQUIRED,
        serviceDate: undefined,
      }),
    ]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: endOfDay(addDays(rulingDate, 28)),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is not expired', () => {
    const rulingDate = new Date()
    const defendants = [
      makeDefendant({
        serviceRequirement: ServiceRequirement.NOT_REQUIRED,
        serviceDate: undefined,
      }),
    ]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: endOfDay(addDays(rulingDate, 3)),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is expired', () => {
    const rulingDate = new Date('2024-05-26T21:51:19.156Z')
    const defendants = [
      makeDefendant({
        serviceRequirement: ServiceRequirement.NOT_REQUIRED,
        serviceDate: undefined,
      }),
    ]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: endOfDay(addDays(rulingDate, 3)),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })
})
