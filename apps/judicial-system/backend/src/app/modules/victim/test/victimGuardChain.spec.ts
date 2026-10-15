import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseTypeGuard } from '../../case/guards/caseType.guard'
import { MinimalCaseExistsForUpdateGuard } from '../../case/guards/minimalCaseExistsForUpdate.guard'
import { MinimalCaseWriteGuard } from '../../case/guards/minimalCaseWrite.guard'
import {
  Case,
  CaseRepositoryService,
  Victim,
  VictimRepositoryService,
} from '../../repository'
import { ValidateVictimGuard } from '../guards/validateVictim.guard'
import { VictimWriteGuard } from '../guards/victimWrite.guard'
import { VictimController } from '../victim.controller'
import { VictimService } from '../victim.service'

// Every route's guards, executed rather than merely declared.
//
// victimControllerGuards.spec.ts pins the declared order and
// victimRolesRules.spec.ts pins that no rule on any route reads the case.
// Neither runs a guard, and a wrong order here is not visible anywhere else:
// guards do not execute in controller unit tests, so a chain that locks the
// case row for every authenticated caller - or one that never reads the case
// the guards after it depend on - passes the whole suite. This table runs
// them, in Nest's order.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const districtCourtRoles = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]

// What each route resolves after the class-level chain: the victim it names
// in the path, which must belong to the case the locking read put on the
// request. Creation names no victim.
type Resolves = 'victim' | undefined

const routes: [string, Resolves, UserRole[]][] = [
  ['create', undefined, [UserRole.PROSECUTOR]],
  ['update', 'victim', [UserRole.PROSECUTOR, ...districtCourtRoles]],
  ['delete', 'victim', [UserRole.PROSECUTOR]],
]

describe.each(routes)(
  'VictimController - %s guard chain',
  (methodName, resolves, allowedRoles) => {
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    const prosecutorsOfficeId = uuid()
    const courtId = uuid()
    const victimId = uuid()

    const prosecutionUser = (
      role: UserRole,
      institutionId = prosecutorsOfficeId,
    ) =>
      ({
        id: uuid(),
        role,
        institution: {
          id: institutionId,
          type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        },
      } as User)

    const districtCourtUser = (role: UserRole) =>
      ({
        id: uuid(),
        role,
        institution: { id: courtId, type: InstitutionType.DISTRICT_COURT },
      } as User)

    const userInRole = (role: UserRole) =>
      districtCourtRoles.includes(role)
        ? districtCourtUser(role)
        : prosecutionUser(role)

    const transaction = {} as Transaction

    // The case row alone - what the minimal read returns. A submitted
    // investigation case is one both the prosecutor and the court may edit
    // victims on, so every allowed role gets through on it. The victim is
    // read by its own guard from the victim service, so it is not on the
    // case.
    const investigationCaseAtOffice = (caseId: string) =>
      ({
        id: caseId,
        type: CaseType.SEARCH_WARRANT,
        state: CaseState.SUBMITTED,
        prosecutorsOfficeId,
        courtId,
      } as Case)

    const victimOnCase = (caseId: string) =>
      ({ id: victimId, caseId } as Victim)

    let mockCaseRepositoryService: CaseRepositoryService
    let mockVictimRepositoryService: VictimRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      params?: { victimId?: string },
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const {
        caseRepositoryService,
        caseService,
        victimRepositoryService,
        logger,
        sequelize,
      } = await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockVictimRepositoryService = victimRepositoryService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard is
      // declared as a configured instance and carries its own allowed case
      // types. RolesGuard gets a real Reflector so it resolves the route's
      // rules from its own metadata. The victim service is the real one over
      // the mocked repository, so the guard's 404 is the service's own.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new MinimalCaseExistsForUpdateGuard(caseService, sequelize),
        new MinimalCaseWriteGuard(),
        new ValidateVictimGuard(
          new VictimService(victimRepositoryService, logger),
          sequelize,
        ),
        new VictimWriteGuard(),
      ]

      runChain = (
        user,
        caseId,
        { victimId: requestedVictimId = victimId } = {},
      ) =>
        runInRequestContext(() =>
          runGuardChain(VictimController, methodName, guards, {
            params: {
              caseId,
              ...(resolves && { victimId: requestedVictimId }),
            },
            user: { currentUser: user },
            case: undefined,
          }),
        )
    })

    describe.each(allowedRoles)(
      "%s at the case's prosecutors office or court",
      (role) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            investigationCaseAtOffice(caseId),
          )
          const mockFindById = mockVictimRepositoryService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(victimOnCase(caseId))

          then = await runChain(userInRole(role), caseId)
        })

        it('should let the whole chain through', () => {
          expect(then.error).toBeUndefined()
          expect(then.rejectedBy).toBeUndefined()
          expect(then.allowed).toBe(true)
        })

        it('should read the case row under the request transaction', () => {
          expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
          expect(
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate,
          ).toHaveBeenCalledWith(caseId, transaction)
        })

        if (resolves) {
          // The victim is read in the same transaction, after the lock: it
          // sees the state the lock protects, and the request holds one
          // connection, not two.
          it('should read the victim in that same transaction', () => {
            expect(mockVictimRepositoryService.findById).toHaveBeenCalledWith(
              victimId,
              { transaction },
            )
          })
        } else {
          it('should not look a victim up', () => {
            expect(mockVictimRepositoryService.findById).not.toHaveBeenCalled()
          })
        }
      },
    )

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
          investigationCaseAtOffice(caseId),
        )

        then = await runChain(userInRole(role), caseId)
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
      it('should not open a transaction or read the case', () => {
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
        expect(
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate,
        ).not.toHaveBeenCalled()
      })
    })

    describe('malformed case id', () => {
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR),
          'not-a-uuid',
        )
      })

      // The id is checked before the transaction is opened, so a request that
      // cannot name a case does not take a connection for nothing.
      it('should be rejected by the case-exists guard without a transaction', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(MinimalCaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(null)

        then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(MinimalCaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })

      // The locking read comes before the victim is resolved, so the victim
      // guard never runs for a case that is not there.
      it('should not look the victim up', () => {
        expect(mockVictimRepositoryService.findById).not.toHaveBeenCalled()
      })
    })

    // Sharing a case with another office gives its prosecutors read access
    // and nothing more: the write guard decides with forUpdate, as
    // CaseWriteGuard does on the full-case routes, and every route here
    // mutates. The access guard would have let this caller through.
    describe('prosecutor at the office the case is shared with', () => {
      const caseId = uuid()
      const sharedWithProsecutorsOfficeId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce({
          ...investigationCaseAtOffice(caseId),
          sharedWithProsecutorsOfficeId,
        } as Case)

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR, sharedWithProsecutorsOfficeId),
          caseId,
        )
      })

      it('should be rejected by MinimalCaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(MinimalCaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    // The guards after the locking read all decide from request.case. Each of
    // them throws a 500 for a missing case and a 403 or 404 for the case it
    // was given, so the error type is what shows the read came first.
    describe('case is not an investigation case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce({
          ...investigationCaseAtOffice(caseId),
          type: CaseType.INDICTMENT,
        } as Case)

        then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
      })

      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    describe('prosecutor at another office', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
          investigationCaseAtOffice(caseId),
        )

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR, uuid()),
          caseId,
        )
      })

      it('should be rejected by MinimalCaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(MinimalCaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    if (resolves) {
      describe('victim belongs to another case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            investigationCaseAtOffice(caseId),
          )
          const mockFindById = mockVictimRepositoryService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(victimOnCase(uuid()))

          then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
        })

        // ValidateVictimGuard reads the victim in the request transaction and
        // matches its caseId against the locked row's id, so it decides from
        // the state the lock protects.
        it('should be rejected by ValidateVictimGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(ValidateVictimGuard.name)
          expect(then.error).toBeInstanceOf(BadRequestException)
        })
      })

      describe('victim does not exist', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            investigationCaseAtOffice(caseId),
          )
          const mockFindById = mockVictimRepositoryService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(null)

          then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
        })

        it('should be rejected by ValidateVictimGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(ValidateVictimGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }

    // VictimWriteGuard is the last guard and decides from the locked row's
    // state: an accepted case is still one the prosecutor may access, but no
    // longer one whose victims may be edited.
    describe('case is past the states in which victims may be edited', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce({
          ...investigationCaseAtOffice(caseId),
          state: CaseState.ACCEPTED,
        } as Case)
        const mockFindById = mockVictimRepositoryService.findById as jest.Mock
        mockFindById.mockResolvedValueOnce(victimOnCase(caseId))

        then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
      })

      it('should be rejected by VictimWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(VictimWriteGuard.name)
        expect(then.error).toBeUndefined()
      })
    })
  },
)
