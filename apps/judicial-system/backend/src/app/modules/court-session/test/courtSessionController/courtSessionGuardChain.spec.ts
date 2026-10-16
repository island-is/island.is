import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseExistsForUpdateGuard } from '../../../case/guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import { Case, CaseRepositoryService, CourtSession } from '../../../repository'
import { CourtSessionController } from '../../courtSession.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'

// Every route's guards, executed rather than merely declared.
//
// courtSessionControllerGuards.spec.ts pins the declared order and
// courtSessionRolesRules.spec.ts pins that no rule on any route reads the
// case. Neither runs a guard, and a wrong order here is not visible anywhere
// else: guards do not execute in controller unit tests, so a chain that locks
// the case row for every authenticated caller - or one that never reads the
// case the guards after it depend on - passes the whole suite. This table
// runs them, in Nest's order, for the first controller converted to the
// guard-owned transaction at class level.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const allowedRoles = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]
const rejectedRoles = Object.values(UserRole).filter(
  (role) => !allowedRoles.includes(role),
)

// The routes that name a session run CourtSessionExistsGuard after the
// class-level chain; create does not.
const routes: [string, boolean][] = [
  ['create', false],
  ['update', true],
  ['createOrUpdateCourtSessionString', true],
  ['upsertAppealDecision', true],
  ['pronounceRulingOrally', true],
  ['delete', true],
]

describe.each(routes)(
  'CourtSessionController - %s guard chain',
  (methodName, namesSession) => {
    const courtId = uuid()
    const courtSessionId = uuid()

    const courtUser = (role: UserRole, institutionId = courtId) =>
      ({
        id: uuid(),
        role,
        institution: {
          id: institutionId,
          type: InstitutionType.DISTRICT_COURT,
        },
      } as User)

    const transaction = {} as Transaction

    const indictmentCaseAtCourt = (caseId: string) =>
      ({
        id: caseId,
        type: CaseType.INDICTMENT,
        state: CaseState.RECEIVED,
        courtId,
        courtSessions: [{ id: courtSessionId, caseId } as CourtSession],
      } as Case)

    let mockCaseRepositoryService: CaseRepositoryService
    let runChain: (
      user: User,
      caseId: string,
      requestedCourtSessionId?: string,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard is
      // declared as a configured instance and carries its own allowed case
      // types. RolesGuard gets a real Reflector so it resolves the route's
      // rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new CourtSessionExistsGuard(),
      ]

      runChain = (user, caseId, requestedCourtSessionId = courtSessionId) =>
        runInRequestContext(() =>
          runGuardChain(CourtSessionController, methodName, guards, {
            params: namesSession
              ? { caseId, courtSessionId: requestedCourtSessionId }
              : { caseId },
            user: { currentUser: user },
            case: undefined,
          }),
        )
    })

    describe.each(allowedRoles)("%s at the case's court", (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(courtUser(role), caseId)
      })

      it('should let the whole chain through', () => {
        expect(then.error).toBeUndefined()
        expect(then.rejectedBy).toBeUndefined()
        expect(then.allowed).toBe(true)
      })

      it('should read the case under the request transaction', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).toHaveBeenCalledWith(caseId, transaction)
      })
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(courtUser(role), caseId)
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of keeping RolesGuard first: this caller is turned away
      // before the case is read, so no FOR UPDATE lock is taken on its behalf.
      // The repository stub is primed with a case above, so this fails if the
      // read happens - rather than passing because the read would have failed
      // anyway.
      it('should not read the case', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(null)

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The three guards after the locking read all decide from request.case.
    // Each of them throws a 500 for a missing case and a 403 or 404 for the
    // case it was given, so the error type is what shows the read came first.
    describe('case is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce({
          ...indictmentCaseAtCourt(caseId),
          type: CaseType.CUSTODY,
        } as Case)

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
      })

      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    describe('judge at another court', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(
          courtUser(UserRole.DISTRICT_COURT_JUDGE, uuid()),
          caseId,
        )
      })

      it('should be rejected by CaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    if (namesSession) {
      describe('court session is not on the case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
            uuid(),
          )
        })

        // CourtSessionExistsGuard looks the session up in the case's own
        // sessions, which is the list delete then checks - both see the
        // locked row.
        it('should be rejected by CourtSessionExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(CourtSessionExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }
  },
)
