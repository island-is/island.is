import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  AppealCaseType,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  EventType,
  IndictmentCaseReviewDecision,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseExistsGuard } from '../../case/guards/caseExists.guard'
import { CaseExistsForUpdateGuard } from '../../case/guards/caseExistsForUpdate.guard'
import { CaseReadGuard } from '../../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../case/guards/caseWrite.guard'
import {
  AppealCase,
  AppealSummons,
  Case,
  CaseRepositoryService,
  Defendant,
  EventLog,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'
import { AppealSummonsExistsGuard } from '../guards/appealSummonsExists.guard'

// The guards of the six appeal summons routes, executed rather than merely
// declared.
//
// appealSummonsControllerGuards.spec.ts pins the declared order. It never runs
// a guard, and a wrong order is not visible anywhere else: guards do not
// execute in controller unit tests, so a chain that locks the case row for
// every authenticated caller - or one that never reads the case the guards
// after it depend on - passes the whole suite. This table runs them, in Nest's
// order, for every user role on each route: the three that change a summons
// lock the case row, and the three that do not must not.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const publicProsecutorsOfficeId = uuid()
const prosecutorsOfficeId = uuid()
const courtId = uuid()
const defendantId = uuid()
const appealSummonsId = uuid()

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

const publicProsecutionUser = (role: UserRole) =>
  userAt(
    role,
    publicProsecutorsOfficeId,
    InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
const prosecutionUser = (role: UserRole) =>
  userAt(role, prosecutorsOfficeId, InstitutionType.POLICE_PROSECUTORS_OFFICE)

// A completed indictment case with a ruling, sent to the public prosecutor,
// whose verdict a defendant has appealed - with one summons on the appeal.
// Neither the reviewer nor the appeal prosecutor is set, so a prosecutor at
// the public prosecution office reaches it only as an appealed case.
const verdictAppealedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    prosecutorsOfficeId,
    courtId,
    eventLogs: [
      {
        eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      } as EventLog,
    ],
    defendants: [
      {
        id: defendantId,
        caseId,
        indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
      } as Defendant,
    ],
    verdictAppealCase: {
      id: uuid(),
      appealType: AppealCaseType.VERDICT,
      appealSummonses: [{ id: appealSummonsId, caseId } as AppealSummons],
    } as AppealCase,
  } as Case)

// The same case while the court still has it: the public prosecution has no
// access to it yet, in either direction.
const receivedIndictmentCase = (caseId: string) =>
  ({
    ...verdictAppealedIndictmentCase(caseId),
    state: CaseState.RECEIVED,
    eventLogs: [] as EventLog[],
  } as Case)

// One row per allowed caller: who they are and the user.
type AllowedRow = [string, User]

const staffRow: AllowedRow = [
  'public prosecution staff',
  publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
]

// Admitted to the case by the read-only fallback for appealed verdicts alone -
// the row that pins confirm to the read guard. See the describe at the end.
const unassignedProsecutorRow: AllowedRow = [
  'a prosecutor at the public prosecution office who is neither the reviewer nor the appeal prosecutor',
  publicProsecutionUser(UserRole.PROSECUTOR),
]

// Whether the route locks the case row, whether it names a summons, and who
// gets through.
const routes: [string, boolean, boolean, AllowedRow[]][] = [
  ['create', true, false, [staffRow]],
  ['update', true, true, [staffRow]],
  ['delete', true, true, [staffRow]],
  ['confirm', false, true, [unassignedProsecutorRow]],
  ['getPdf', false, true, [staffRow, unassignedProsecutorRow]],
  ['preview', false, false, [staffRow]],
]

describe.each(routes)(
  'AppealSummonsController - %s guard chain',
  (methodName, locksCase, namesSummons, allowedRows) => {
    const allowedRoles = allowedRows.map(([, user]) => user.role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    // The access guard the route declares after its read.
    const accessGuardName = locksCase ? CaseWriteGuard.name : CaseReadGuard.name
    const existsGuardName = locksCase
      ? CaseExistsForUpdateGuard.name
      : CaseExistsGuard.name

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let request: { case?: Case; appealSummons?: AppealSummons }
    let runChain: (
      user: User,
      caseId: string,
      requestedSummonsId?: string,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    // The read the route must make, and the one it must not.
    const expectedRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLiveByIdForUpdate
        : mockCaseRepositoryService.findLiveById) as jest.Mock
    const forbiddenRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLiveById
        : mockCaseRepositoryService.findLiveByIdForUpdate) as jest.Mock

    const primeCase = (theCase: Case | null) => {
      // Both reads are primed, so a route making the wrong one fails on the
      // assertion below rather than on a missing case.
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)
    }

    const expectTheRead = (caseId: string) => {
      expect(expectedRead()).toHaveBeenCalledWith(
        caseId,
        locksCase ? transaction : expect.anything(),
      )
      expect(forbiddenRead()).not.toHaveBeenCalled()

      // The lock lives in the request transaction, which only the locking
      // read opens.
      if (locksCase) {
        expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      } else {
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      }
    }

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class, including the
      // controller's class-level JwtAuthUserGuard and RolesGuard, which Nest
      // runs before the method-level ones. CaseTypeGuard is declared as a
      // configured instance and carries its own allowed case types. RolesGuard
      // gets a real Reflector so it resolves the route's rules from its own
      // metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseExistsGuard(caseService),
        new CaseWriteGuard(),
        new CaseReadGuard(),
        new AppealSummonsExistsGuard(),
      ]

      runChain = (user, caseId, requestedSummonsId = appealSummonsId) => {
        request = {
          params: namesSummons
            ? { caseId, appealSummonsId: requestedSummonsId }
            : { caseId },
          user: { currentUser: user },
          body: {},
          case: undefined,
        } as typeof request

        return runInRequestContext(() =>
          runGuardChain(AppealSummonsController, methodName, guards, request),
        )
      }
    })

    describe.each(allowedRows)('%s', (_who, user) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedIndictmentCase(caseId))

        then = await runChain(user, caseId)
      })

      it('should let the whole chain through', () => {
        expect(then.error).toBeUndefined()
        expect(then.rejectedBy).toBeUndefined()
        expect(then.allowed).toBe(true)
      })

      it(
        locksCase
          ? 'should read the case under the request transaction'
          : 'should read the case without locking it',
        () => {
          expectTheRead(caseId)
        },
      )

      if (namesSummons) {
        // The handler acts on request.appealSummons, so what it sees must be
        // the copy on the case the guard read - under the lock, on the three
        // routes that take one - not one looked up elsewhere.
        it('should hand the handler the summons as the case it read carries it', () => {
          const summonsOnCase =
            request.case?.verdictAppealCase?.appealSummonses?.find(
              (candidate) => candidate.id === appealSummonsId,
            )

          expect(summonsOnCase).toBeDefined()
          expect(request.appealSummons).toBe(summonsOnCase)
        })
      }
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(verdictAppealedIndictmentCase(caseId))

        // At the public prosecution office, so that the role alone is what
        // turns them away.
        then = await runChain(publicProsecutionUser(role), caseId)
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of keeping RolesGuard ahead of the read: this caller is
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

        then = await runChain(allowedRows[0][1], caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(existsGuardName)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the read all decide from request.case. Each of them
    // throws a 500 for a missing case and a 403 or 404 for the case it was
    // given, so the error type is what shows the read came first.
    describe('case is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase({
          ...verdictAppealedIndictmentCase(caseId),
          type: CaseType.CUSTODY,
        } as Case)

        then = await runChain(allowedRows[0][1], caseId)
      })

      // CaseTypeGuard moved to route level with the exists guard, since it
      // decides from request.case - so it can only reach this verdict after
      // the read has put the case there.
      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case first', () => {
        expectTheRead(caseId)
      })
    })

    // What RolesGuard leaves: a caller in a listed role on a case they cannot
    // reach gets as far as the read, and is turned away by the access guard
    // from the case it read. On the three locking routes that guard is the
    // write guard, and this row together with the allowed rows above pins
    // the swap from the read guard on the two case shapes here: the same
    // role gets through on the one and is refused on the other. That the
    // swap changes nothing on any case follows from canUserAccessCase, which
    // sends public prosecution staff through a check that never looks at
    // whether the access is for an update.
    describe('case the court has not sent to the public prosecutor', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(receivedIndictmentCase(caseId))

        then = await runChain(allowedRows[0][1], caseId)
      })

      it(`should be rejected by ${accessGuardName}`, () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(accessGuardName)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case first', () => {
        expectTheRead(caseId)
      })
    })

    if (namesSummons) {
      describe('summons is not on the case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(verdictAppealedIndictmentCase(caseId))

          then = await runChain(allowedRows[0][1], caseId, uuid())
        })

        // AppealSummonsExistsGuard looks the summons up among the case's
        // verdict appeal's own summonses, which is where the handler's summons
        // then comes from - both see the case the guard read.
        it('should be rejected by AppealSummonsExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(AppealSummonsExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })

        it('should have read the case first', () => {
          expectTheRead(caseId)
        })
      })
    }
  },
)

// confirm keeps the read guard, and the allowed row above - a prosecutor at
// the public prosecution office with no assignment on the case - is what
// breaks if it is swapped for the write guard. The write rule for prosecution
// users admits the case's own office, its reviewer and its appeal prosecutor;
// that prosecutor reaches the case only through canUserAccessCase's read-only
// fallback for appealed verdicts. These rows are the other half: the same
// guard refusing the same role when the fallback does not apply.
describe('AppealSummonsController - confirm admitted through the appealed-verdict fallback', () => {
  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new CaseExistsGuard(caseService),
      new CaseWriteGuard(),
      new CaseReadGuard(),
      new AppealSummonsExistsGuard(),
    ]

    runChain = (user, caseId) =>
      runInRequestContext(() =>
        runGuardChain(AppealSummonsController, 'confirm', guards, {
          params: { caseId, appealSummonsId },
          user: { currentUser: user },
          body: {},
          case: undefined,
        }),
      )
  })

  describe('the verdict has not been appealed', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...verdictAppealedIndictmentCase(caseId),
        defendants: [{ id: defendantId, caseId } as Defendant],
      } as Case)

      then = await runChain(publicProsecutionUser(UserRole.PROSECUTOR), caseId)
    })

    it('should be rejected by CaseReadGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseReadGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  // RolesGuard admits the role - prosecutorRule is a bare PROSECUTOR - and the
  // access check is what tells the public prosecution's prosecutor from one
  // at a police prosecutors office that has nothing to do with the case.
  describe("a prosecutor at a police prosecutors office other than the case's", () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...verdictAppealedIndictmentCase(caseId),
        prosecutorsOfficeId: uuid(),
      } as Case)

      then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
    })

    it('should be rejected by CaseReadGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseReadGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })
})
