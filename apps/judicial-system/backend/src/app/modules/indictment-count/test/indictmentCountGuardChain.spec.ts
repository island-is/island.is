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
import { MinimalCaseAccessGuard } from '../../case/guards/minimalCaseAccess.guard'
import { MinimalCaseExistsForUpdateGuard } from '../../case/guards/minimalCaseExistsForUpdate.guard'
import { Case, CaseRepositoryService, IndictmentCount } from '../../repository'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from '../guards/offenseExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'
import { IndictmentCountService } from '../indictmentCount.service'

// Every route's guards, executed rather than merely declared.
//
// indictmentCountControllerGuards.spec.ts pins the declared order and
// indictmentCountRolesRules.spec.ts pins that no rule on any route reads the
// case. Neither runs a guard, and a wrong order here is not visible anywhere
// else: guards do not execute in controller unit tests, so a chain that locks
// the case row for every authenticated caller - or one that never reads the
// case the guards after it depend on - passes the whole suite. This table
// runs them, in Nest's order.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const allowedRoles = [UserRole.PROSECUTOR, UserRole.PROSECUTOR_REPRESENTATIVE]
const rejectedRoles = Object.values(UserRole).filter(
  (role) => !allowedRoles.includes(role),
)

// What each route resolves after the class-level chain: the indictment count
// it names in the path, which must belong to the case the locking read put on
// the request, and the offense, which must be one of that count's own.
type Resolves = 'count' | 'offense' | undefined

const routes: [string, Resolves][] = [
  ['create', undefined],
  ['update', 'count'],
  ['delete', 'count'],
  ['createOffense', 'count'],
  ['updateOffense', 'offense'],
  ['deleteOffense', 'offense'],
  ['reorder', undefined],
]

describe.each(routes)(
  'IndictmentCountController - %s guard chain',
  (methodName, resolves) => {
    const prosecutorsOfficeId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()

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

    const transaction = {} as Transaction

    // The case row alone - what the minimal read returns. The indictment count
    // is read by its own guard from the indictment count service, so it is
    // not on the case.
    const indictmentCaseAtOffice = (caseId: string) =>
      ({
        id: caseId,
        type: CaseType.INDICTMENT,
        state: CaseState.DRAFT,
        prosecutorsOfficeId,
      } as Case)

    const indictmentCountOnCase = (caseId: string) =>
      ({
        id: indictmentCountId,
        caseId,
        offenses: [{ id: offenseId, indictmentCountId }],
      } as IndictmentCount)

    let mockCaseRepositoryService: CaseRepositoryService
    let mockIndictmentCountService: IndictmentCountService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      params?: { indictmentCountId?: string; offenseId?: string },
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const {
        caseRepositoryService,
        caseService,
        indictmentCountService,
        sequelize,
      } = await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockIndictmentCountService = indictmentCountService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard is
      // declared as a configured instance and carries its own allowed case
      // types. RolesGuard gets a real Reflector so it resolves the route's
      // rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new MinimalCaseExistsForUpdateGuard(caseService, sequelize),
        new MinimalCaseAccessGuard(),
        new IndictmentCountExistsGuard(indictmentCountService, sequelize),
        new OffenseExistsGuard(),
      ]

      runChain = (
        user,
        caseId,
        {
          indictmentCountId: requestedIndictmentCountId = indictmentCountId,
          offenseId: requestedOffenseId = offenseId,
        } = {},
      ) =>
        runInRequestContext(() =>
          runGuardChain(IndictmentCountController, methodName, guards, {
            params: {
              caseId,
              ...(resolves && {
                indictmentCountId: requestedIndictmentCountId,
              }),
              ...(resolves === 'offense' && { offenseId: requestedOffenseId }),
            },
            user: { currentUser: user },
            case: undefined,
          }),
        )
    })

    describe.each(allowedRoles)(
      "%s at the case's prosecutors office",
      (role) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtOffice(caseId),
          )
          const mockFindById = mockIndictmentCountService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(indictmentCountOnCase(caseId))

          then = await runChain(prosecutionUser(role), caseId)
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
          // The count is read in the same transaction, after the lock: it
          // sees the state the lock protects, and the request holds one
          // connection, not two.
          it('should read the indictment count in that same transaction', () => {
            expect(mockIndictmentCountService.findById).toHaveBeenCalledWith(
              indictmentCountId,
              { transaction },
            )
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
          indictmentCaseAtOffice(caseId),
        )

        then = await runChain(prosecutionUser(role), caseId)
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

      // The locking read comes before the indictment count is resolved, so
      // the count guard never runs for a case that is not there.
      it('should not look the indictment count up', () => {
        expect(mockIndictmentCountService.findById).not.toHaveBeenCalled()
      })
    })

    // The guards after the locking read all decide from request.case. Each of
    // them throws a 500 for a missing case and a 403 or 404 for the case it
    // was given, so the error type is what shows the read came first.
    describe('case is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveMinimalByIdForUpdate =
          mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
        mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce({
          ...indictmentCaseAtOffice(caseId),
          type: CaseType.CUSTODY,
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
          indictmentCaseAtOffice(caseId),
        )

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR, uuid()),
          caseId,
        )
      })

      it('should be rejected by MinimalCaseAccessGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(MinimalCaseAccessGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    if (resolves) {
      describe('indictment count belongs to another case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtOffice(caseId),
          )
          const mockFindById = mockIndictmentCountService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(indictmentCountOnCase(uuid()))

          then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId)
        })

        // IndictmentCountExistsGuard reads the count in the request
        // transaction and matches its caseId against the locked row's id, so
        // it decides from the state the lock protects.
        it('should be rejected by IndictmentCountExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(IndictmentCountExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }

    if (resolves === 'offense') {
      describe('offense is not on the indictment count', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveMinimalByIdForUpdate =
            mockCaseRepositoryService.findLiveMinimalByIdForUpdate as jest.Mock
          mockFindLiveMinimalByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtOffice(caseId),
          )
          const mockFindById = mockIndictmentCountService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce(indictmentCountOnCase(caseId))

          then = await runChain(prosecutionUser(UserRole.PROSECUTOR), caseId, {
            offenseId: uuid(),
          })
        })

        it('should be rejected by OffenseExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(OffenseExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }
  },
)
