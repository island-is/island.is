import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RouteRolesGuard,
} from '@island.is/judicial-system/auth'
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
import { CaseNotCompletedGuard } from '../../../case/guards/caseNotCompleted.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import { Case, CaseFile, CaseRepositoryService } from '../../../repository'
import { FileController } from '../../file.controller'
import { FileService } from '../../file.service'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

// The guards of the four routes that edit a file - reject it, confirm a
// ruling order, attach a ruling order's document, reorder the files -
// executed rather than merely declared.
//
// The per-route *Guards.spec.ts pin the declared order, and the roles-rules
// specs pin which rules read the case. Neither runs a guard, and a wrong
// order is not visible anywhere else: guards do not execute in controller
// unit tests, so a chain that locks the case row for every authenticated
// caller - or one whose roles rule decides before the case it needs has been
// read - passes the whole suite. This table runs them, in Nest's order, for
// every user role on each route.
//
// Three of the routes have bare roles rules, so RolesGuard turns an unlisted
// role away before the locking read. Confirming a ruling order is the fourth:
// its rule checks that the user is the case's registered judge, so RolesGuard
// has to follow the read, and RouteRolesGuard - the same rule, decided on the
// role alone - stands in front of it.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const prosecutorsOfficeId = uuid()
const courtId = uuid()
const fileId = uuid()

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

const prosecutionUser = (role: UserRole, officeId = prosecutorsOfficeId) =>
  userAt(role, officeId, InstitutionType.POLICE_PROSECUTORS_OFFICE)
const courtUser = (role: UserRole, atCourtId = courtId) =>
  userAt(role, atCourtId, InstitutionType.DISTRICT_COURT)

// The judge registered on the cases below, and a colleague at the same court.
const registeredJudge = courtUser(UserRole.DISTRICT_COURT_JUDGE)
const anotherJudgeAtTheCourt = courtUser(UserRole.DISTRICT_COURT_JUDGE)

// The routes that name a file find it on the case the guard loaded.
const atCourt = (caseId: string, type: CaseType, state: CaseState) =>
  ({
    id: caseId,
    type,
    state,
    courtId,
    prosecutorsOfficeId,
    judgeId: registeredJudge.id,
    caseFiles: [{ id: fileId, caseId } as CaseFile],
  } as Case)

const receivedIndictment = (caseId: string) =>
  atCourt(caseId, CaseType.INDICTMENT, CaseState.RECEIVED)
const draftIndictment = (caseId: string) =>
  atCourt(caseId, CaseType.INDICTMENT, CaseState.DRAFT)
const completedIndictment = (caseId: string) =>
  atCourt(caseId, CaseType.INDICTMENT, CaseState.COMPLETED)
const receivedCustodyCase = (caseId: string) =>
  atCourt(caseId, CaseType.CUSTODY, CaseState.RECEIVED)

// A rejection by a guard after the locking read.
interface AfterReadRejection {
  name: string
  user: User
  caseFor?: (caseId: string) => Case
  params?: Record<string, string>
  rejectedBy: string
  // Left out for a guard that returns false rather than throwing.
  error?: new (...args: never[]) => Error
}

interface Route {
  method: string
  params: Record<string, string>
  // The guard that turns a role the route has no rule for away, ahead of the
  // locking read.
  roleGuard: string
  // One user per allowed role, on a received indictment they can write.
  allowed: User[]
  afterRead: AfterReadRejection[]
}

const districtCourtUsers = [
  registeredJudge,
  courtUser(UserRole.DISTRICT_COURT_REGISTRAR),
  courtUser(UserRole.DISTRICT_COURT_ASSISTANT),
]

// What the three routes that name a file on an indictment have in common
// behind the read, for a user in a role the route lists.
const indictmentFileRejections = (user: User): AfterReadRejection[] => [
  {
    name: 'case is not an indictment',
    user,
    caseFor: receivedCustodyCase,
    rejectedBy: CaseTypeGuard.name,
    error: ForbiddenException,
  },
  {
    name: 'user at another court than the case is at',
    user: courtUser(user.role, uuid()),
    rejectedBy: CaseWriteGuard.name,
    error: ForbiddenException,
  },
  {
    name: 'file is not on the case',
    user,
    params: { fileId: uuid() },
    rejectedBy: CaseFileExistsGuard.name,
    error: NotFoundException,
  },
]

const routes: Route[] = [
  {
    method: 'rejectCaseFile',
    params: { fileId },
    roleGuard: RolesGuard.name,
    allowed: districtCourtUsers,
    afterRead: indictmentFileRejections(
      courtUser(UserRole.DISTRICT_COURT_REGISTRAR),
    ),
  },
  {
    method: 'confirmRulingOrder',
    params: { fileId },
    roleGuard: RouteRolesGuard.name,
    allowed: [registeredJudge],
    afterRead: [
      // The reason RolesGuard cannot go first on this route: it is the case
      // that says whether this judge may confirm. RouteRolesGuard let them
      // through on the role, so they do reach the lock.
      {
        name: "district court judge who is not the case's judge",
        user: anotherJudgeAtTheCourt,
        rejectedBy: RolesGuard.name,
      },
      // A judge at another court is not the case's judge either, and is
      // turned away by RolesGuard before CaseWriteGuard is asked. What
      // CaseWriteGuard is left to refuse is the case's own judge on a case
      // the court cannot write yet.
      ...indictmentFileRejections(registeredJudge).filter(
        ({ rejectedBy }) => rejectedBy !== CaseWriteGuard.name,
      ),
      {
        name: "the case's judge on an indictment not yet submitted",
        user: registeredJudge,
        caseFor: draftIndictment,
        rejectedBy: CaseWriteGuard.name,
        error: ForbiddenException,
      },
    ],
  },
  {
    method: 'attachRulingOrderDocument',
    params: { fileId },
    roleGuard: RolesGuard.name,
    allowed: districtCourtUsers,
    afterRead: indictmentFileRejections(
      courtUser(UserRole.DISTRICT_COURT_ASSISTANT),
    ),
  },
  {
    method: 'updateFiles',
    params: {},
    roleGuard: RolesGuard.name,
    allowed: [
      prosecutionUser(UserRole.PROSECUTOR),
      prosecutionUser(UserRole.PROSECUTOR_REPRESENTATIVE),
    ],
    afterRead: [
      {
        name: "prosecutor at another office than the case's",
        user: prosecutionUser(UserRole.PROSECUTOR, uuid()),
        rejectedBy: CaseWriteGuard.name,
        error: ForbiddenException,
      },
      {
        name: 'case is completed',
        user: prosecutionUser(UserRole.PROSECUTOR),
        caseFor: completedIndictment,
        rejectedBy: CaseNotCompletedGuard.name,
        error: ForbiddenException,
      },
    ],
  },
]

describe.each(routes.map((route) => [route.method, route] as const))(
  'FileController - %s guard chain',
  (methodName, { params, roleGuard, allowed, afterRead }) => {
    const allowedRoles = allowed.map(({ role }) => role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      overrideParams?: Record<string, string>,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    // Both reads are primed, so a route making the plain one fails on the
    // assertion below rather than on a missing case.
    const primeCase = (theCase: Case | null) => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)
    }

    // The lock lives in the request transaction, which only the locking read
    // opens - and it is the only read of the case the chain makes.
    const expectTheLockingRead = (caseId: string) => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
      expect(mockCaseRepositoryService.findLiveById).not.toHaveBeenCalled()
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
      // controller's class-level JwtAuthUserGuard, which Nest runs before the
      // method-level ones. CaseTypeGuard is declared as a configured instance
      // and carries its own allowed case types. RouteRolesGuard and
      // RolesGuard get a real Reflector so they resolve the route's rules
      // from its own metadata. CaseFileExistsGuard finds the file on the case
      // the read loaded and never calls the service it is handed.
      const guards = [
        new AuthenticatedGuard(),
        new RouteRolesGuard(new Reflector()),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new CaseFileExistsGuard({} as FileService),
        new CaseNotCompletedGuard(),
      ]

      runChain = (user, caseId, overrideParams = {}) =>
        runInRequestContext(() =>
          runGuardChain(FileController, methodName, guards, {
            params: { caseId, ...params, ...overrideParams },
            user: { currentUser: user },
            body: {},
            case: undefined,
          }),
        )
    })

    describe.each(allowed.map((user) => [user.role, user] as const))(
      '%s on a case they can write',
      (_role, user) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(receivedIndictment(caseId))

          then = await runChain(user, caseId)
        })

        it('should let the whole chain through', () => {
          expect(then.error).toBeUndefined()
          expect(then.rejectedBy).toBeUndefined()
          expect(then.allowed).toBe(true)
        })

        it('should read the case under the request transaction', () => {
          expectTheLockingRead(caseId)
        })
      },
    )

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(receivedIndictment(caseId))

        then = await runChain(courtUser(role), caseId)
      })

      it(`should be rejected by ${roleGuard}`, () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(roleGuard)
      })

      // The point of deciding on the role ahead of the read: this caller is
      // turned away before the case is read, so no FOR UPDATE lock is taken
      // on its behalf. Both repository stubs are primed with a case above, so
      // this fails if a read happens - rather than passing because the read
      // would have failed anyway.
      it('should not read the case', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).not.toHaveBeenCalled()
        expect(mockCaseRepositoryService.findLiveById).not.toHaveBeenCalled()
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(allowed[0], caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // Every guard behind the read decides from request.case. The ones that
    // throw do so with a 500 or a 400 for a missing case and a 403 or 404 for
    // the case they were given, so the error type shows the read came first;
    // RolesGuard on the confirm route returns false either way, and its row
    // relies on the read assertion instead.
    describe.each(afterRead.map((row) => [row.name, row] as const))(
      '%s',
      (_name, { user, caseFor, params: overrideParams, rejectedBy, error }) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase((caseFor ?? receivedIndictment)(caseId))

          then = await runChain(user, caseId, overrideParams)
        })

        it(`should be rejected by ${rejectedBy}`, () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(rejectedBy)

          if (error) {
            expect(then.error).toBeInstanceOf(error)
          } else {
            expect(then.error).toBeUndefined()
          }
        })

        it('should have read the case under the request transaction first', () => {
          expectTheLockingRead(caseId)
        })
      },
    )
  },
)
