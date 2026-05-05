import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import each from 'jest-each'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { Case } from '../models/case.model'
import { getIndictmentInfo, transformCase } from './case.transformer'

// Note: case-level appeal-info computation moved to the backend's
// CaseInterceptor in step 6c of the Appeal Ruling Order project. Tests for
// `getRequestCaseLevelAppealInfo`, `getIndictmentCaseLevelAppealInfo`,
// `getAppealCaseInfo`, and `getRulingOrderAppealInfo` now live in
// apps/judicial-system/backend/src/app/modules/case/interceptors/test/
// case.interceptor.appealInfo.spec.ts.

describe('transformCase', () => {
  each`
    originalValue | transformedValue
    ${null}       | ${false}
    ${false}      | ${false}
    ${true}       | ${true}
  `.describe(
    'when transforming boolean case attributes',
    ({ originalValue, transformedValue }) => {
      it(`should transform ${originalValue} requestProsecutorOnlySession to ${transformedValue}`, () => {
        const theCase = {
          type: CaseType.CUSTODY,
          requestProsecutorOnlySession: originalValue,
        } as Case

        const res = transformCase(theCase)

        expect(res.requestProsecutorOnlySession).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isClosedCourtHidden to ${transformedValue}`, () => {
        const theCase = {
          type: CaseType.CUSTODY,
          isClosedCourtHidden: originalValue,
        } as Case

        const res = transformCase(theCase)

        expect(res.isClosedCourtHidden).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isHightenedSecurityLevel to ${transformedValue}`, () => {
        const theCase = {
          type: CaseType.CUSTODY,
          isHeightenedSecurityLevel: originalValue,
        } as Case

        const res = transformCase(theCase)

        expect(res.isHeightenedSecurityLevel).toBe(transformedValue)
      })
    },
  )

  describe('isValidToDateInThePast', () => {
    it('should not set custody end date in the past if no custody end date', () => {
      const theCase = {} as Case

      const res = transformCase(theCase)

      expect(res.isValidToDateInThePast).toBeUndefined()
    })

    it('should set custody end date in the past to false if custody end date in the future', () => {
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() + 1)
      const theCase = {
        type: CaseType.CUSTODY,
        validToDate: validToDate.toISOString(),
      } as Case

      const res = transformCase(theCase)

      expect(res.isValidToDateInThePast).toBe(false)
    })

    it('should set custody end date in the past to true if custody end date in the past', () => {
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() - 1)
      const theCase = {
        type: CaseType.CUSTODY,
        validToDate: validToDate.toISOString(),
      } as Case

      const res = transformCase(theCase)

      expect(res.isValidToDateInThePast).toBe(true)
    })
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
    const rulingDate = '2022-06-15T19:50:08.033Z'

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-13T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when some defendants have yet to view the verdict', () => {
    const rulingDate = '2022-06-14T19:50:08.033Z'

    const defendants = [
      {
        verdict: {
          serviceDate: '2022-06-15T19:50:08.033Z',
          serviceRequirement: ServiceRequirement.REQUIRED,
        },
      },
      {
        verdict: {
          serviceDate: undefined,
          serviceRequirement: ServiceRequirement.REQUIRED,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-12T23:59:59.999Z',
      indictmentVerdictViewedByAll: false,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when no defendants have yet to view the verdict', () => {
    const rulingDate = '2022-06-14T19:50:08.033Z'
    const defendants = [
      { verdict: { serviceDate: '2022-06-15T19:50:08.033Z' } },
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-12T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is not expired', () => {
    const courtEndTime = new Date()
    const rulingDate = new Date()
    const defendants = [
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate: rulingDate.toISOString(),
      defendants,
    })

    const expectedIndictmentAppealDeadline = endOfDay(addDays(courtEndTime, 3))

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: expectedIndictmentAppealDeadline.toISOString(),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is expired', () => {
    const rulingDate = '2024-05-26T21:51:19.156Z'
    const defendants = [
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2024-05-29T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })
})
