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
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  AppealEventType,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseReadGuard } from '../../case/guards/caseRead.guard'
import { CaseWriteGuard } from '../../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../../case/guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../../case/guards/limitedAccessCaseExistsForUpdate.guard'
import { CivilClaimantExistsGuard } from '../../defendant/guards/civilClaimantExists.guard'
import { DefendantExistsGuard } from '../../defendant/guards/defendantExists.guard'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CaseRepositoryService,
  CivilClaimant,
  Defendant,
} from '../../repository'
import { AppealCaseExistsGuard } from '../guards/appealCaseExists.guard'
import { DefenceAdvocateOfPartyGuard } from '../guards/defenceAdvocateOfParty.guard'
import { LimitedAccessAppealCaseController } from '../limitedAccessAppealCase.controller'

// The guards of every route on the limited access appeal case controller,
// executed rather than merely declared: the three routes that change an
// appeal case and now lock the case row, and the two appointment-letter
// routes that keep the plain read.
//
// appealCaseController/transitionRolesRules.spec.ts pins what the defender's
// transition rule decides from a request the case and appeal case guards have
// already populated. It never runs a guard, and a wrong order is not visible
// anywhere else: guards do not execute in controller unit tests, so a chain
// that locks the case row for every authenticated caller - or one that lets
// RolesGuard decide before the case it reads is there - passes the whole
// suite. This table runs them, in Nest's order, for every user role on each
// route.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const defenderNationalId = '0101010000'
const spokespersonNationalId = '0202020000'
const appealCaseId = uuid()
const defendantId = uuid()
const civilClaimantId = uuid()

const userAt = (
  role: UserRole,
  nationalId: string,
  institutionType: InstitutionType,
) =>
  ({
    id: uuid(),
    role,
    nationalId,
    institution: { id: uuid(), type: institutionType },
  } as User)

// Both defence users, who belong to no institution: the one the district
// court confirmed for the defendant, and the one it confirmed as the civil
// claimant's spokesperson.
const defenceUser = (nationalId: string) =>
  ({ id: uuid(), role: UserRole.DEFENDER, nationalId } as User)

const defender = () => defenceUser(defenderNationalId)
const spokesperson = () => defenceUser(spokespersonNationalId)

// A case-level ruling appeal, as the appellant's side made it: the defence
// may withdraw its own, not the prosecution's.
const rulingAppealBy = (appellant: UserRole) =>
  ({
    id: appealCaseId,
    appealType: AppealCaseType.RULING,
    appealState: AppealCaseState.APPEALED,
    appealEventLogs: [
      {
        eventType: AppealEventType.APPEALED,
        userRole: appellant,
      } as AppealEventLog,
    ],
  } as AppealCase)

// An accepted custody case whose one defendant has this defender, appealed by
// the defence: the defender reads and writes it, and may withdraw the appeal.
const appealedCustodyCase = (caseId: string, appellant = UserRole.DEFENDER) =>
  ({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    decision: CaseDecision.ACCEPTING,
    defendants: [{ id: defendantId, caseId, defenderNationalId } as Defendant],
    appealCase: rulingAppealBy(appellant),
  } as Case)

// The same case while the court still has it: no defence user can reach it.
const receivedCustodyCase = (caseId: string) =>
  ({
    ...appealedCustodyCase(caseId),
    state: CaseState.RECEIVED,
    decision: undefined,
  } as Case)

// A completed indictment case with a confirmed defender on its defendant and
// a confirmed spokesperson on its civil claimant: each reads it, and each
// reads their own party's appointment letter.
const completedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    defendants: [
      {
        id: defendantId,
        caseId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
      } as Defendant,
    ],
    civilClaimants: [
      {
        id: civilClaimantId,
        caseId,
        hasSpokesperson: true,
        isSpokespersonConfirmed: true,
        spokespersonNationalId,
      } as CivilClaimant,
    ],
  } as Case)

// The same case before an arraignment has been scheduled: no defence user
// can reach it yet.
const receivedIndictmentCase = (caseId: string) =>
  ({
    ...completedIndictmentCase(caseId),
    state: CaseState.RECEIVED,
  } as Case)

interface Route {
  route: string
  // Whether the route reads the case under FOR UPDATE in the request
  // transaction, and so declares RouteRolesGuard ahead of the read.
  locksCase: boolean
  // Whether the route names an appeal case, and so declares
  // AppealCaseExistsGuard after the read.
  namesAppealCase: boolean
  params: Record<string, string>
  body: object
  // The defence user the route admits, a case they can reach and the same
  // case while they cannot.
  user: User
  allowedCase: (caseId: string) => Case
  deniedCase: (caseId: string) => Case
}

const routes: Route[] = [
  {
    route: 'create',
    locksCase: true,
    namesAppealCase: false,
    params: {},
    body: {},
    user: defender(),
    allowedCase: appealedCustodyCase,
    deniedCase: receivedCustodyCase,
  },
  {
    route: 'createEventLog',
    locksCase: true,
    namesAppealCase: true,
    params: { appealCaseId },
    body: { eventType: AppealEventType.APPEAL_STATEMENT_SENT },
    user: defender(),
    allowedCase: appealedCustodyCase,
    deniedCase: receivedCustodyCase,
  },
  {
    route: 'transition',
    locksCase: true,
    namesAppealCase: true,
    params: { appealCaseId },
    body: { transition: AppealCaseTransition.WITHDRAW_APPEAL },
    user: defender(),
    allowedCase: appealedCustodyCase,
    deniedCase: receivedCustodyCase,
  },
  {
    route: 'getDefenderAppointmentLetterPdf',
    locksCase: false,
    namesAppealCase: false,
    params: { defendantId },
    body: {},
    user: defender(),
    allowedCase: completedIndictmentCase,
    deniedCase: receivedIndictmentCase,
  },
  {
    route: 'getSpokespersonAppointmentLetterPdf',
    locksCase: false,
    namesAppealCase: false,
    params: { civilClaimantId },
    body: {},
    user: spokesperson(),
    allowedCase: completedIndictmentCase,
    deniedCase: receivedIndictmentCase,
  },
]

// The chain runs a stand-in for the class-level JwtAuthUserGuard, and the
// harness only refuses a declared guard with no instance, never an instance
// that goes unused - so this is what notices the real guard being dropped
// from the controller.
describe('LimitedAccessAppealCaseController - class-level guards', () => {
  it('should require an authenticated user on every route', () => {
    expect(
      Reflect.getMetadata('__guards__', LimitedAccessAppealCaseController),
    ).toContain(JwtAuthUserGuard)
  })
})

// Every route admits the defender role and no other.
const rejectedRoles = Object.values(UserRole).filter(
  (role) => role !== UserRole.DEFENDER,
)

describe.each(routes)(
  'LimitedAccessAppealCaseController - $route guard chain',
  ({
    route,
    locksCase,
    namesAppealCase,
    params,
    body,
    user,
    allowedCase,
    deniedCase,
  }) => {
    // The guard that turns an unlisted role away, the read the route must
    // make and the access guard that decides from what it read.
    const roleGuardName = locksCase ? RouteRolesGuard.name : RolesGuard.name
    const existsGuardName = locksCase
      ? LimitedAccessCaseExistsForUpdateGuard.name
      : LimitedAccessCaseExistsGuard.name
    const accessGuardName = locksCase ? CaseWriteGuard.name : CaseReadGuard.name

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      requestParams?: Record<string, string>,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    // The read the route must make, and the one it must not.
    const expectedRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLimitedAccessByIdForUpdate
        : mockCaseRepositoryService.findLimitedAccessById) as jest.Mock
    const forbiddenRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLimitedAccessById
        : mockCaseRepositoryService.findLimitedAccessByIdForUpdate) as jest.Mock

    const primeCase = (theCase: Case | null) => {
      // Both reads are primed, so a route making the wrong one fails on the
      // assertion below rather than on a missing case.
      const mockFindLimitedAccessById =
        mockCaseRepositoryService.findLimitedAccessById as jest.Mock
      mockFindLimitedAccessById.mockResolvedValueOnce(theCase)

      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(theCase)
    }

    // A defence user has their view of the linked cases narrowed - the same
    // narrowing on either read. The lock lives in the request transaction,
    // which only the locking read opens.
    const expectTheRead = (caseId: string) => {
      expect(expectedRead()).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: user.nationalId,
        transaction: locksCase ? transaction : undefined,
      })
      expect(forbiddenRead()).not.toHaveBeenCalled()

      if (locksCase) {
        expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      } else {
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      }
    }

    const expectNoLock = () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).not.toHaveBeenCalled()
      expect(mockSequelize.transaction).not.toHaveBeenCalled()
    }

    beforeEach(async () => {
      const { caseRepositoryService, limitedAccessCaseService, sequelize } =
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
      // from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RouteRolesGuard(new Reflector()),
        new LimitedAccessCaseExistsForUpdateGuard(
          limitedAccessCaseService,
          sequelize,
        ),
        new LimitedAccessCaseExistsGuard(limitedAccessCaseService),
        new AppealCaseExistsGuard(),
        new RolesGuard(new Reflector()),
        new CaseWriteGuard(),
        new CaseReadGuard(),
        new DefendantExistsGuard(),
        new CivilClaimantExistsGuard(),
        new DefenceAdvocateOfPartyGuard(),
      ]

      runChain = (user, caseId, requestParams = params) =>
        runInRequestContext(() =>
          runGuardChain(LimitedAccessAppealCaseController, route, guards, {
            params: { caseId, ...requestParams },
            user: { currentUser: user },
            body,
            case: undefined,
          }),
        )
    })

    describe('the defence user the route admits, on a case they can reach', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowedCase(caseId))

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
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowedCase(caseId))

        then = await runChain(
          userAt(role, defenderNationalId, InstitutionType.DISTRICT_COURT),
          caseId,
        )
      })

      it(`should be rejected by ${roleGuardName}`, () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(roleGuardName)
      })

      // The point of the pre-filter on the locking routes: this caller is
      // turned away before the case is read, so no FOR UPDATE lock is taken
      // on its behalf. On the reading routes RolesGuard decides after the
      // plain read, which locks nothing. Both repository stubs are primed
      // with a case above, so this fails if a locking read happens - rather
      // than passing because the read would have failed anyway.
      it(
        locksCase ? 'should not read the case' : 'should not lock the case',
        () => {
          expectNoLock()

          if (locksCase) {
            expect(
              mockCaseRepositoryService.findLimitedAccessById,
            ).not.toHaveBeenCalled()
          }
        },
      )
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(user, caseId)
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
    describe('case the court still has', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(deniedCase(caseId))

        then = await runChain(user, caseId)
      })

      // What the pre-filter leaves on the locking routes: a caller in the
      // listed role on a case they cannot write reaches the locking read, and
      // is turned away by CaseWriteGuard from the case it read.
      it(`should be rejected by ${accessGuardName}`, () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(accessGuardName)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case first', () => {
        expectTheRead(caseId)
      })
    })

    if (namesAppealCase) {
      describe('appeal case is not on the locked case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(allowedCase(caseId))

          then = await runChain(user, caseId, { appealCaseId: uuid() })
        })

        // AppealCaseExistsGuard looks the appeal case up among the case's
        // own appeals, which is where the handler's appeal case then comes
        // from - both see the locked case.
        it('should be rejected by AppealCaseExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(AppealCaseExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })

        it('should have read the case under the request transaction first', () => {
          expectTheRead(caseId)
        })
      })
    }
  },
)

// RolesGuard stays after the locking read because the defender's transition
// rule reads the request's case and appeal case. The allowed WITHDRAW_APPEAL
// row above is what breaks if it is moved ahead of the read - the rule denies
// on a missing case. This row is the other half: the same rule denying from
// what the read put on the request, after the read.
describe('LimitedAccessAppealCaseController - rules that read the locked case', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, limitedAccessCaseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new AuthenticatedGuard(),
      new RouteRolesGuard(new Reflector()),
      new LimitedAccessCaseExistsForUpdateGuard(
        limitedAccessCaseService,
        sequelize,
      ),
      new AppealCaseExistsGuard(),
      new RolesGuard(new Reflector()),
      new CaseWriteGuard(),
    ]

    runChain = (user, caseId) =>
      runInRequestContext(() =>
        runGuardChain(LimitedAccessAppealCaseController, 'transition', guards, {
          params: { caseId, appealCaseId },
          user: { currentUser: user },
          body: { transition: AppealCaseTransition.WITHDRAW_APPEAL },
          case: undefined,
        }),
      )
  })

  describe('defender withdrawing an appeal the prosecution made', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(
        appealedCustodyCase(caseId, UserRole.PROSECUTOR),
      )

      then = await runChain(defender(), caseId)
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: defenderNationalId,
        transaction,
      })
    })
  })
})
