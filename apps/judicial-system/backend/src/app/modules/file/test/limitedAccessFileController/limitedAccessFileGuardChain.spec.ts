import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseDecision,
  CaseFileCategory,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseReadGuard } from '../../../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../../../case/guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../../../case/guards/limitedAccessCaseExistsForUpdate.guard'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { CivilClaimantExistsGuard } from '../../../defendant/guards/civilClaimantExists.guard'
import { DefendantExistsGuard } from '../../../defendant/guards/defendantExists.guard'
import {
  AppealCase,
  Case,
  CaseFile,
  CaseRepositoryService,
  CivilClaimant,
  Defendant,
} from '../../../repository'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { DeleteAppealCaseFileGuard } from '../../guards/deleteAppealCaseFile.guard'
import { LimitedAccessCreateCaseFileGuard } from '../../guards/limitedAccessCreateCaseFile.guard'
import { LimitedAccessCreateCivilClaimantCaseFileGuard } from '../../guards/limitedAccessCreateCivilClaimantCaseFile.guard'
import { LimitedAccessCreateDefendantCaseFileGuard } from '../../guards/limitedAccessCreateDefendantCaseFile.guard'
import { LimitedAccessDeleteCaseFileGuard } from '../../guards/limitedAccessDeleteCaseFile.guard'
import { LimitedAccessViewCaseFileGuard } from '../../guards/limitedAccessViewCaseFile.guard'
import { SplitCaseFileExistsGuard } from '../../guards/splitCaseFileExists.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

// The guards of the six limited access file routes, executed rather than
// merely declared.
//
// limitedAccessFileControllerGuards.spec.ts and the per-route *Guards.spec.ts
// pin the declared order. They never run a guard, and a wrong order is not
// visible anywhere else: guards do not execute in controller unit tests, so a
// chain that locks the case row for every authenticated caller - or one that
// never reads the case the guards after it depend on - passes the whole
// suite. This table runs them, in Nest's order, for every user role on each
// route: the three that create a file lock the case row, and the three that
// do not must not.
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
const prisonId = uuid()
const defendantId = uuid()
const civilClaimantId = uuid()
const appealFileId = uuid()
const rulingFileId = uuid()

const userAt = (
  role: UserRole,
  institutionId: string,
  institutionType: InstitutionType,
) =>
  ({
    id: uuid(),
    role,
    nationalId: defenderNationalId,
    institution: { id: institutionId, type: institutionType },
  } as User)

const defenderUser = () =>
  userAt(UserRole.DEFENDER, uuid(), InstitutionType.POLICE_PROSECUTORS_OFFICE)
const prisonStaffUser = () =>
  userAt(UserRole.PRISON_SYSTEM_STAFF, prisonId, InstitutionType.PRISON)

// An accepted custody case whose one defendant has this defender, carrying an
// appeal case file the defender uploaded and the appeal ruling: reachable by
// the defender and by prison staff.
const acceptedCustodyCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    decision: CaseDecision.ACCEPTING,
    defendants: [{ id: defendantId, caseId, defenderNationalId } as Defendant],
    caseFiles: [
      {
        id: appealFileId,
        caseId,
        category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      } as CaseFile,
      {
        id: rulingFileId,
        caseId,
        category: CaseFileCategory.APPEAL_RULING,
      } as CaseFile,
    ],
  } as Case)

// The same case with another defender on it: this defender cannot reach it.
const anotherDefendersCustodyCase = (caseId: string) =>
  ({
    ...acceptedCustodyCase(caseId),
    defendants: [
      {
        id: defendantId,
        caseId,
        defenderNationalId: '0202020000',
      } as Defendant,
    ],
  } as Case)

// The same case while the court still has it: prison staff cannot reach it.
const receivedCustodyCase = (caseId: string) =>
  ({
    ...acceptedCustodyCase(caseId),
    state: CaseState.RECEIVED,
    decision: undefined,
  } as Case)

// The custody case after the court of appeals has registered the appeal: the
// party appeal files on it can no longer be deleted.
const custodyCaseAtCourtOfAppeals = (caseId: string) =>
  ({
    ...acceptedCustodyCase(caseId),
    appealCase: { id: uuid(), appealCaseNumber: '1-2026' } as AppealCase,
  } as Case)

// A completed indictment case where this user is the confirmed defender of
// the defendant and the confirmed spokesperson of the civil claimant.
const completedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    defendants: [
      {
        id: defendantId,
        caseId,
        defenderNationalId,
        isDefenderChoiceConfirmed: true,
      } as Defendant,
    ],
    civilClaimants: [
      {
        id: civilClaimantId,
        caseId,
        hasSpokesperson: true,
        isSpokespersonConfirmed: true,
        spokespersonNationalId: defenderNationalId,
      } as CivilClaimant,
    ],
  } as Case)

// The same case before either choice was confirmed: not reachable yet.
const unconfirmedIndictmentCase = (caseId: string) =>
  ({
    ...completedIndictmentCase(caseId),
    defendants: [
      {
        id: defendantId,
        caseId,
        defenderNationalId,
        isDefenderChoiceConfirmed: false,
      } as Defendant,
    ],
    civilClaimants: [
      {
        id: civilClaimantId,
        caseId,
        hasSpokesperson: true,
        isSpokespersonConfirmed: false,
        spokespersonNationalId: defenderNationalId,
      } as CivilClaimant,
    ],
  } as Case)

const appealFileBody = { category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE }
const prosecutorFileBody = {
  category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
}

// One row per allowed caller: who they are, the user, a case they can reach
// and one they cannot.
interface AllowedRow {
  who: string
  user: User
  caseFor: (caseId: string) => Case
  deniedCaseFor: (caseId: string) => Case
}

// A rejection by a guard after the read, from the case it was given.
interface AfterReadRejection {
  name: string
  caseFor?: (caseId: string) => Case
  params?: Record<string, string>
  body?: Record<string, unknown>
  rejectedBy: string
  error?: new (...args: never[]) => Error
}

interface Route {
  method: string
  locksCase: boolean
  // The access guard the route declares after its read: the signed url is
  // the one read-only route, the rest write - the presigned post and the
  // delete too, though neither locks the case.
  accessGuard: string
  params: Record<string, string>
  body: Record<string, unknown>
  allowed: AllowedRow[]
  afterRead: AfterReadRejection[]
}

const defenderOnCustodyCase: AllowedRow = {
  who: 'defender of the defendant',
  user: defenderUser(),
  caseFor: acceptedCustodyCase,
  deniedCaseFor: anotherDefendersCustodyCase,
}

const defenderOnIndictmentCase: AllowedRow = {
  who: 'confirmed defender of the defendant',
  user: defenderUser(),
  caseFor: completedIndictmentCase,
  deniedCaseFor: unconfirmedIndictmentCase,
}

const spokespersonOnIndictmentCase: AllowedRow = {
  who: 'confirmed spokesperson of the civil claimant',
  user: defenderUser(),
  caseFor: completedIndictmentCase,
  deniedCaseFor: unconfirmedIndictmentCase,
}

const prisonStaffOnCustodyCase: AllowedRow = {
  who: 'prison staff',
  user: prisonStaffUser(),
  caseFor: acceptedCustodyCase,
  deniedCaseFor: receivedCustodyCase,
}

const routes: Route[] = [
  {
    method: 'createPresignedPost',
    locksCase: false,
    accessGuard: CaseWriteGuard.name,
    params: {},
    body: {},
    allowed: [defenderOnCustodyCase],
    afterRead: [],
  },
  {
    method: 'createCaseFile',
    locksCase: true,
    accessGuard: CaseWriteGuard.name,
    params: {},
    body: appealFileBody,
    allowed: [defenderOnCustodyCase],
    afterRead: [
      {
        name: 'category the defender may not upload',
        body: prosecutorFileBody,
        rejectedBy: LimitedAccessCreateCaseFileGuard.name,
      },
    ],
  },
  {
    method: 'createDefendantCaseFile',
    locksCase: true,
    accessGuard: CaseWriteGuard.name,
    params: { defendantId },
    body: appealFileBody,
    allowed: [defenderOnIndictmentCase],
    afterRead: [
      {
        name: 'case is not an indictment case',
        caseFor: acceptedCustodyCase,
        rejectedBy: CaseTypeGuard.name,
        error: ForbiddenException,
      },
      {
        name: 'defendant is not on the case',
        params: { defendantId: uuid() },
        rejectedBy: DefendantExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'category the defender may not upload',
        body: prosecutorFileBody,
        rejectedBy: LimitedAccessCreateDefendantCaseFileGuard.name,
      },
    ],
  },
  {
    method: 'createCivilClaimantCaseFile',
    locksCase: true,
    accessGuard: CaseWriteGuard.name,
    params: { civilClaimantId },
    body: appealFileBody,
    allowed: [spokespersonOnIndictmentCase],
    afterRead: [
      {
        name: 'case is not an indictment case',
        caseFor: acceptedCustodyCase,
        rejectedBy: CaseTypeGuard.name,
        error: ForbiddenException,
      },
      {
        name: 'civil claimant is not on the case',
        params: { civilClaimantId: uuid() },
        rejectedBy: CivilClaimantExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'category the spokesperson may not upload',
        body: prosecutorFileBody,
        rejectedBy: LimitedAccessCreateCivilClaimantCaseFileGuard.name,
      },
    ],
  },
  {
    method: 'getCaseFileSignedUrl',
    locksCase: false,
    accessGuard: CaseReadGuard.name,
    params: { fileId: rulingFileId },
    body: {},
    allowed: [prisonStaffOnCustodyCase, defenderOnCustodyCase],
    afterRead: [
      {
        name: 'file is not on the case',
        params: { fileId: uuid() },
        rejectedBy: SplitCaseFileExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'file the caller may not view',
        params: { fileId: appealFileId },
        rejectedBy: LimitedAccessViewCaseFileGuard.name,
        error: ForbiddenException,
      },
    ],
  },
  {
    method: 'deleteCaseFile',
    locksCase: false,
    accessGuard: CaseWriteGuard.name,
    params: { fileId: appealFileId },
    body: {},
    allowed: [defenderOnCustodyCase],
    afterRead: [
      {
        name: 'file is not on the case',
        params: { fileId: uuid() },
        rejectedBy: CaseFileExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'file the defender may not delete',
        params: { fileId: rulingFileId },
        rejectedBy: LimitedAccessDeleteCaseFileGuard.name,
      },
      {
        name: 'appeal the court of appeals has registered',
        caseFor: custodyCaseAtCourtOfAppeals,
        rejectedBy: DeleteAppealCaseFileGuard.name,
        error: ForbiddenException,
      },
    ],
  },
]

describe.each(routes.map((route) => [route.method, route] as const))(
  'LimitedAccessFileController - %s guard chain',
  (
    methodName,
    { locksCase, accessGuard, params, body, allowed, afterRead },
  ) => {
    const allowedRoles = allowed.map(({ user }) => user.role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    const existsGuardName = locksCase
      ? LimitedAccessCaseExistsForUpdateGuard.name
      : LimitedAccessCaseExistsGuard.name

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      overrides?: {
        params?: Record<string, string>
        body?: Record<string, unknown>
      },
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

    // Only a defence user has their view of the linked cases narrowed - the
    // same narrowing on either read.
    const expectTheRead = (caseId: string, user: User) => {
      expect(expectedRead()).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId:
          user.role === UserRole.DEFENDER ? user.nationalId : undefined,
        transaction: locksCase ? transaction : undefined,
      })
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
      const {
        caseRepositoryService,
        caseService,
        fileService,
        limitedAccessCaseService,
        sequelize,
      } = await createTestingCaseModule()

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
        new LimitedAccessCaseExistsForUpdateGuard(
          limitedAccessCaseService,
          sequelize,
        ),
        new LimitedAccessCaseExistsGuard(limitedAccessCaseService),
        new CaseWriteGuard(),
        new CaseReadGuard(),
        new MergedCaseExistsGuard(caseService),
        new DefendantExistsGuard(),
        new CivilClaimantExistsGuard(),
        new LimitedAccessCreateCaseFileGuard(),
        new LimitedAccessCreateDefendantCaseFileGuard(),
        new LimitedAccessCreateCivilClaimantCaseFileGuard(),
        new SplitCaseFileExistsGuard(),
        new LimitedAccessViewCaseFileGuard(),
        new CaseFileExistsGuard(fileService),
        new LimitedAccessDeleteCaseFileGuard(),
        new DeleteAppealCaseFileGuard(),
      ]

      runChain = (user, caseId, overrides = {}) =>
        runInRequestContext(() =>
          runGuardChain(LimitedAccessFileController, methodName, guards, {
            params: { caseId, ...params, ...overrides.params },
            user: { currentUser: user },
            body: overrides.body ?? body,
            case: undefined,
          }),
        )
    })

    describe.each(allowed.map((row) => [row.who, row] as const))(
      '%s',
      (_who, { user, caseFor }) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(caseFor(caseId))

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
            expectTheRead(caseId, user)
          },
        )
      },
    )

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowed[0].caseFor(caseId))

        then = await runChain(
          userAt(role, prisonId, InstitutionType.PRISON),
          caseId,
        )
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
          mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
        ).not.toHaveBeenCalled()
        expect(
          mockCaseRepositoryService.findLimitedAccessById,
        ).not.toHaveBeenCalled()
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(allowed[0].user, caseId)
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
    describe.each(allowed.map((row) => [row.who, row] as const))(
      '%s on a case they cannot reach',
      (_who, { user, deniedCaseFor }) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(deniedCaseFor(caseId))

          then = await runChain(user, caseId)
        })

        it(`should be rejected by ${accessGuard}`, () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(accessGuard)
          expect(then.error).toBeInstanceOf(ForbiddenException)
        })

        it('should have read the case first', () => {
          expectTheRead(caseId, user)
        })
      },
    )

    if (afterRead.length > 0) {
      describe.each(afterRead.map((row) => [row.name, row] as const))(
        '%s',
        (
          _name,
          {
            caseFor,
            params: overrideParams,
            body: overrideBody,
            rejectedBy,
            error,
          },
        ) => {
          const caseId = uuid()
          let then: Awaited<ReturnType<typeof runChain>>

          beforeEach(async () => {
            primeCase((caseFor ?? allowed[0].caseFor)(caseId))

            then = await runChain(allowed[0].user, caseId, {
              params: overrideParams,
              body: overrideBody,
            })
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

          it('should have read the case first', () => {
            expectTheRead(caseId, allowed[0].user)
          })
        },
      )
    }
  },
)
