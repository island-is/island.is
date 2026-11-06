import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  AppealCaseState,
  AppealCaseType,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { AppealCaseExistsGuard } from '../../appeal-case/guards/appealCaseExists.guard'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../case'
import {
  AppealCase,
  AppealCourtSession,
  Case,
  CaseRepositoryService,
} from '../../repository'
import { AppealCourtSessionController } from '../appealCourtSession.controller'
import { AppealCourtSessionExistsGuard } from '../guards/appealCourtSessionExists.guard'

// The guards of the three appeal court session routes, executed rather than
// merely declared. They are all declared at class level, bar the session
// guard on update and delete, and every route changes a session under a
// case row read FOR UPDATE.
//
// appealCourtSessionRolesRules.spec.ts pins that no rule on these routes
// reads the case, which is what lets RolesGuard run ahead of the locking
// read. It never runs a guard, and a wrong order is not visible anywhere
// else: guards do not execute in controller unit tests, so a chain that locks
// the case row for every authenticated caller passes the whole suite. This
// table runs them, in Nest's order, for every user role on each route.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const appealCaseId = uuid()
const appealCourtSessionId = uuid()

const userAt = (
  role: UserRole,
  institutionId: string,
  institutionType: InstitutionType,
) =>
  ({
    id: uuid(),
    role,
    institution: { id: institutionId, type: institutionType },
  } as User)

const courtOfAppealsUser = (role: UserRole) =>
  userAt(role, uuid(), InstitutionType.COURT_OF_APPEALS)

const courtOfAppealsRoles = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]

const rejectedRoles = Object.values(UserRole).filter(
  (role) => !courtOfAppealsRoles.includes(role),
)

// A verdict appeal with one court session: the court of appeals sees a
// verdict appeal from the moment it is filed.
const verdictAppeal = () =>
  ({
    id: appealCaseId,
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.APPEALED,
    courtSessions: [{ id: appealCourtSessionId } as AppealCourtSession],
  } as AppealCase)

// A completed indictment case whose verdict has been appealed: writable by
// the court of appeals.
const verdictAppealedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    verdictAppealCase: verdictAppeal(),
  } as Case)

// The same appeal on a case of a type the routes do not take.
const verdictAppealedCustodyCase = (caseId: string) =>
  ({
    ...verdictAppealedIndictmentCase(caseId),
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
  } as Case)

// Whether the route names a session, and so declares
// AppealCourtSessionExistsGuard after the appeal case is resolved.
const routes: [string, boolean][] = [
  ['create', false],
  ['update', true],
  ['delete', true],
]

describe.each(routes)(
  'AppealCourtSessionController - %s guard chain',
  (methodName, namesSession) => {
    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      requestedIds?: { appealCaseId?: string; appealCourtSessionId?: string },
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    const primeCase = (theCase: Case | null) => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)
    }

    const expectTheLockingRead = (caseId: string) => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    }

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class, including the
      // class-level JwtAuthUserGuard, which Nest runs before the method-level
      // ones. CaseTypeGuard is declared as a configured instance and carries
      // its own allowed case types. RolesGuard gets a real Reflector so it
      // resolves the route's rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new AppealCaseExistsGuard(),
        new CaseWriteGuard(),
        new AppealCourtSessionExistsGuard(),
      ]

      runChain = (user, caseId, requestedIds = {}) =>
        runInRequestContext(() =>
          runGuardChain(AppealCourtSessionController, methodName, guards, {
            params: {
              caseId,
              appealCaseId: requestedIds.appealCaseId ?? appealCaseId,
              ...(namesSession
                ? {
                    appealCourtSessionId:
                      requestedIds.appealCourtSessionId ?? appealCourtSessionId,
                  }
                : {}),
            },
            user: { currentUser: user },
            body: {},
            case: undefined,
          }),
        )
    })

    describe.each(courtOfAppealsRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedIndictmentCase(caseId))

        then = await runChain(courtOfAppealsUser(role), caseId)
      })

      it('should let the whole chain through', () => {
        expect(then.error).toBeUndefined()
        expect(then.rejectedBy).toBeUndefined()
        expect(then.allowed).toBe(true)
      })

      it('should read the case under the request transaction', () => {
        expectTheLockingRead(caseId)
      })
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedIndictmentCase(caseId))

        then = await runChain(
          userAt(role, uuid(), InstitutionType.COURT_OF_APPEALS),
          caseId,
        )
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of keeping RolesGuard ahead of the read: this caller is
      // turned away before the case is read, so no FOR UPDATE lock is taken
      // on its behalf. The repository stub is primed with a case above, so
      // this fails if the read happens - rather than passing because the
      // read would have failed anyway.
      it('should not read the case', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).not.toHaveBeenCalled()
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(
          courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
          caseId,
        )
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the locking read all decide from request.case. Each
    // of them throws a 500 for a missing case and a 403 or 404 for the case
    // it was given, so the error type is what shows the read came first.
    describe('case that is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedCustodyCase(caseId))

        then = await runChain(
          courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
          caseId,
        )
      })

      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case under the request transaction first', () => {
        expectTheLockingRead(caseId)
      })
    })

    describe('appeal case is not on the locked case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedIndictmentCase(caseId))

        then = await runChain(
          courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
          caseId,
          { appealCaseId: uuid() },
        )
      })

      // AppealCaseExistsGuard looks the appeal case up among the case's own
      // appeals, which is where the handler's appeal case then comes from -
      // both see the locked case.
      it('should be rejected by AppealCaseExistsGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(AppealCaseExistsGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })

      it('should have read the case under the request transaction first', () => {
        expectTheLockingRead(caseId)
      })
    })

    if (namesSession) {
      describe('session is not on the appeal case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(verdictAppealedIndictmentCase(caseId))

          then = await runChain(
            courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
            caseId,
            { appealCourtSessionId: uuid() },
          )
        })

        // The session is resolved on the appeal case the locked case carries,
        // so a session of another appeal is not found through this route.
        it('should be rejected by AppealCourtSessionExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(AppealCourtSessionExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })

        it('should have read the case under the request transaction first', () => {
          expectTheLockingRead(caseId)
        })
      })
    }
  },
)
