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

import { createTestingCaseModule } from '../createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { DefendantExistsGuard } from '../../../defendant'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { CaseController } from '../../case.controller'
import { CaseExistsForUpdateGuard } from '../../guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

// The split route's guards, executed rather than merely declared.
//
// caseControllerGuards.spec.ts pins the declared order and
// splitRolesRules.spec.ts pins that no rule on this route reads the case.
// Neither runs a guard, and a wrong order here is not visible anywhere else:
// guards do not execute in controller unit tests, so a chain that locks the
// case row for every authenticated caller - or one that never reads the case
// the three guards after it depend on - passes the whole suite. This table
// runs them, in Nest's order, for the second route converted to the
// guard-owned transaction.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

describe('CaseController - Split defendant from case guard chain', () => {
  const courtId = uuid()
  const defendantId = uuid()

  const districtCourtJudge = {
    id: uuid(),
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { id: courtId, type: InstitutionType.DISTRICT_COURT },
  } as User

  const prosecutor = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    institution: {
      id: uuid(),
      type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
    },
  } as User

  const transaction = {} as Transaction

  const indictmentCaseWithTwoDefendants = (caseId: string) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      courtId,
      defendants: [
        { id: defendantId, caseId } as Defendant,
        { id: uuid(), caseId } as Defendant,
      ],
    } as Case)

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
    splitDefendantId?: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    // One instance per guard the chain declares as a class, including
    // CaseController's class-level JwtAuthUserGuard, which Nest runs before
    // the method-level ones. CaseTypeGuard is declared as a configured
    // instance and carries its own allowed case types. RolesGuard gets a real
    // Reflector so it resolves the route's rules from its own metadata.
    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new CaseWriteGuard(),
      new DefendantExistsGuard(),
    ]

    runChain = (user, caseId, splitDefendantId = defendantId) =>
      runInRequestContext(() =>
        runGuardChain(CaseController, 'splitDefendantFromCase', guards, {
          params: { caseId, defendantId: splitDefendantId },
          user: { currentUser: user },
          case: undefined,
        }),
      )
  })

  describe('district court judge splitting a defendant off their own case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentCaseWithTwoDefendants(caseId),
      )

      then = await runChain(districtCourtJudge, caseId)
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

  describe('user in a role the route has no rule for', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentCaseWithTwoDefendants(caseId),
      )

      then = await runChain(prosecutor, caseId)
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

    // The point of keeping RolesGuard first: this caller is turned away before
    // the case is read, so no FOR UPDATE lock is taken on its behalf. The
    // repository stub is primed with a case above, so this fails if the read
    // happens - rather than passing because the read would have failed anyway.
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

      then = await runChain(districtCourtJudge, caseId)
    })

    it('should be rejected by the case-exists guard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('case is not an indictment case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce({
        ...indictmentCaseWithTwoDefendants(caseId),
        type: CaseType.CUSTODY,
      } as Case)

      then = await runChain(districtCourtJudge, caseId)
    })

    // CaseTypeGuard decides from request.case, so it can only reach this
    // verdict after the locking read has put the case there.
    it('should be rejected by CaseTypeGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseTypeGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('defendant is not on the case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentCaseWithTwoDefendants(caseId),
      )

      then = await runChain(districtCourtJudge, caseId, uuid())
    })

    // DefendantExistsGuard looks the defendant up in the case's own
    // defendants, which is the list the handler then counts - both see the
    // locked row.
    it('should be rejected by DefendantExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(DefendantExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
