import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { UpdateCaseDto } from '../../dto/updateCase.dto'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../../guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../../guards/limitedAccessCaseExistsForUpdate.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

// The guards of the two routes that read the case through the limited access
// guards - update, which now locks the case row, and getById, which keeps the
// plain read - executed rather than merely declared. The PDF and zip routes
// of this controller read through CaseExistsGuard and are not part of this.
//
// updateGuards.spec.ts and getByIdGuards.spec.ts pin the declared order. They
// never run a guard, and a wrong order is not visible anywhere else: guards do
// not execute in controller unit tests, so a chain that locks the case row for
// every authenticated caller - or one that never reads the case the guards
// after it depend on - passes the whole suite. This table runs them, in Nest's
// order, for every user role on each route.
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
const prisonAdminId = uuid()
const prisonId = uuid()
const defendantId = uuid()

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
const prisonAdminUser = () =>
  userAt(
    UserRole.PRISON_SYSTEM_STAFF,
    prisonAdminId,
    InstitutionType.PRISON_ADMIN,
  )
const prisonStaffUser = () =>
  userAt(UserRole.PRISON_SYSTEM_STAFF, prisonId, InstitutionType.PRISON)

// An accepted custody case whose one defendant has this defender: readable
// by the defender, by prison staff and by the prison admin, and writable by
// the prison admin.
const acceptedCustodyCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    decision: CaseDecision.ACCEPTING,
    defendants: [{ id: defendantId, caseId, defenderNationalId } as Defendant],
  } as Case)

// The same case while the court still has it: no limited access user can
// reach it.
const receivedCustodyCase = (caseId: string) =>
  ({
    ...acceptedCustodyCase(caseId),
    state: CaseState.RECEIVED,
    decision: undefined,
  } as Case)

const prisonAdminBody: Partial<UpdateCaseDto> = { validToDate: new Date() }

// One row per allowed caller: who they are and the user.
type AllowedRow = [string, User]

const defenderRow: AllowedRow = ['defender of the defendant', defenderUser()]
const prisonAdminRow: AllowedRow = ['prison admin', prisonAdminUser()]
const prisonStaffRow: AllowedRow = ['prison staff', prisonStaffUser()]

// Whether the route locks the case row, the body it is sent, and who gets
// through on an accepted custody case.
const routes: [string, boolean, Partial<UpdateCaseDto>, AllowedRow[]][] = [
  ['update', true, prisonAdminBody, [prisonAdminRow]],
  ['getById', false, {}, [defenderRow, prisonStaffRow, prisonAdminRow]],
]

describe.each(routes)(
  'LimitedAccessCaseController - %s guard chain',
  (methodName, locksCase, body, allowedRows) => {
    const allowedRoles = allowedRows.map(([, user]) => user.role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    // The access guard the route declares after its read.
    const accessGuardName = locksCase ? CaseWriteGuard.name : CaseReadGuard.name
    const existsGuardName = locksCase
      ? LimitedAccessCaseExistsForUpdateGuard.name
      : LimitedAccessCaseExistsGuard.name

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      requestBody?: Partial<UpdateCaseDto>,
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
      const { caseRepositoryService, limitedAccessCaseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard
      // is declared as a configured instance and carries its own allowed
      // case types. RolesGuard gets a real Reflector so it resolves the
      // route's rules from its own metadata.
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
        new CaseCompletedGuard(),
      ]

      runChain = (user, caseId, requestBody = body) =>
        runInRequestContext(() =>
          runGuardChain(LimitedAccessCaseController, methodName, guards, {
            params: { caseId },
            user: { currentUser: user },
            body: requestBody,
            case: undefined,
          }),
        )
    })

    describe.each(allowedRows)('%s', (_who, user) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(acceptedCustodyCase(caseId))

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
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(acceptedCustodyCase(caseId))

        then = await runChain(
          userAt(role, prisonAdminId, InstitutionType.PRISON_ADMIN),
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

        then = await runChain(allowedRows[0][1], caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(existsGuardName)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the read all decide from request.case. Each of them
    // throws a 500 for a missing case and a 403 for the case it was given, so
    // the error type is what shows the read came first.
    describe('case the court has not decided', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(receivedCustodyCase(caseId))

        then = await runChain(allowedRows[0][1], caseId)
      })

      it(`should be rejected by ${accessGuardName}`, () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(accessGuardName)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case first', () => {
        expectTheRead(caseId, allowedRows[0][1])
      })
    })
  },
)

// What RolesGuard decides on update before the lock, beyond the role: the
// rule is a field rule for the prison admin alone.
describe('LimitedAccessCaseController - update guard chain, decided before the lock', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let mockSequelize: Sequelize
  let runChain: (
    user: User,
    caseId: string,
    body: Partial<UpdateCaseDto>,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, limitedAccessCaseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSequelize = sequelize

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new LimitedAccessCaseExistsForUpdateGuard(
        limitedAccessCaseService,
        sequelize,
      ),
      new CaseWriteGuard(),
      new CaseCompletedGuard(),
    ]

    runChain = (user, caseId, body) =>
      runInRequestContext(() =>
        runGuardChain(LimitedAccessCaseController, 'update', guards, {
          params: { caseId },
          user: { currentUser: user },
          body,
          case: undefined,
        }),
      )
  })

  const expectNoRead = () => {
    expect(
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
    ).not.toHaveBeenCalled()
    expect(mockSequelize.transaction).not.toHaveBeenCalled()
  }

  // Prison staff share the role with the prison admin; the rule itself tells
  // them apart, from the user alone, so they are turned away without a read.
  describe('prison staff at a prison', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(
        acceptedCustodyCase(caseId),
      )

      then = await runChain(prisonStaffUser(), caseId, prisonAdminBody)
    })

    it('should be rejected by RolesGuard without reading the case', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
      expectNoRead()
    })
  })

  describe('prison admin sending a field outside their rule', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(
        acceptedCustodyCase(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, {
        courtCaseNumber: 'R-1/2026',
      })
    })

    it('should be rejected by RolesGuard without reading the case', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
      expectNoRead()
    })
  })

  // CaseCompletedGuard is declared after the write guard, and for the prison
  // admin - the only caller the rule admits - every case the write guard
  // lets through is a completed one, so it has no row of its own here: it
  // runs on every allowed row above, and decides from the locked case.
})
