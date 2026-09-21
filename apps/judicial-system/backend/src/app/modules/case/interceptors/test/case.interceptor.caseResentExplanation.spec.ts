import { firstValueFrom, of } from 'rxjs'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  CaseState,
  CaseType,
  DateType,
  InstitutionType,
  RequestSharedWithDefender,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case, CaseRepositoryService, DateLog } from '../../../repository'
import { CaseInterceptor } from '../case.interceptor'

const caseResentExplanation = 'the case was resent'

const prosecutor = {
  role: UserRole.PROSECUTOR,
  nationalId: '0101010101',
  institution: { type: InstitutionType.PROSECUTORS_OFFICE },
} as User

const defender = {
  role: UserRole.DEFENDER,
  nationalId: '0202020202',
} as User

const prisonStaff = {
  role: UserRole.PRISON_SYSTEM_STAFF,
  nationalId: '0303030303',
  institution: { type: InstitutionType.PRISON },
} as User

const arraignmentDateLog = {
  dateType: DateType.ARRAIGNMENT_DATE,
  date: new Date('2024-01-10'),
} as DateLog

const makeCase = (theCase: Partial<Case>) =>
  ({
    type: CaseType.CUSTODY,
    caseResentExplanation,
    toJSON: () => ({ caseResentExplanation }),
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

const intercept = async (theCase: Case, user: User) => {
  const interceptor = new CaseInterceptor({
    findOriginalAncestorId: (aCase: Case) => Promise.resolve(aCase.id),
  } as unknown as CaseRepositoryService)

  return firstValueFrom(
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => ({ user: { currentUser: user } }),
        }),
      } as unknown as ExecutionContext,
      { handle: () => of(theCase) } as unknown as CallHandler,
    ),
  )
}

describe('CaseInterceptor - caseResentExplanation', () => {
  describe('when the user has full access', () => {
    it('should reveal the resent explanation even when the request is not shared', async () => {
      const theCase = makeCase({ state: CaseState.RECEIVED })

      const res = await intercept(theCase, prosecutor)

      expect(res.caseResentExplanation).toBe(caseResentExplanation)
    })
  })

  describe('when the case is an indictment', () => {
    it('should reveal the resent explanation to a defender', async () => {
      const theCase = makeCase({
        type: CaseType.INDICTMENT,
        state: CaseState.RECEIVED,
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBe(caseResentExplanation)
    })
  })

  describe('when the user has limited access', () => {
    it('should hide the resent explanation when the request is not shared', async () => {
      const theCase = makeCase({ state: CaseState.RECEIVED })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBeUndefined()
    })

    it('should hide the resent explanation when the case is not in an allowed state', async () => {
      const theCase = makeCase({
        state: CaseState.DRAFT,
        requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBeUndefined()
    })

    it('should reveal the resent explanation when the request is shared and the case is in an allowed state', async () => {
      const theCase = makeCase({
        state: CaseState.SUBMITTED,
        requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBe(caseResentExplanation)
    })

    it('should hide the resent explanation when shared from the court date but no arraignment has been scheduled', async () => {
      const theCase = makeCase({
        state: CaseState.RECEIVED,
        requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBeUndefined()
    })

    it('should reveal the resent explanation when shared from the court date and an arraignment has been scheduled', async () => {
      const theCase = makeCase({
        state: CaseState.RECEIVED,
        requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
        dateLogs: [arraignmentDateLog],
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBe(caseResentExplanation)
    })

    it('should reveal the resent explanation on a completed case that was never shared', async () => {
      const theCase = makeCase({
        state: CaseState.ACCEPTED,
        requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
      })

      const res = await intercept(theCase, defender)

      expect(res.caseResentExplanation).toBe(caseResentExplanation)
    })

    it('should hide the resent explanation from prison system users too', async () => {
      const theCase = makeCase({ state: CaseState.RECEIVED })

      const res = await intercept(theCase, prisonStaff)

      expect(res.caseResentExplanation).toBeUndefined()
    })
  })
})
