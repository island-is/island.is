import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseState,
  CaseTransition,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'
import { CaseController } from '../../case.controller'
import { CaseExistsForUpdateGuard } from '../../guards/caseExistsForUpdate.guard'
import { CaseTransitionGuard } from '../../guards/caseTransition.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

// The transition route's guards, executed rather than merely declared.
//
// caseControllerGuards.spec.ts pins the declared order and
// transitionRolesRules.spec.ts pins the one rule that reads request.case.
// Neither runs a guard, so neither would have caught the reversed chain that
// rejected every prosecutor transition with a 403 - it passed the whole suite,
// lint and CI, and was found by a person reading the diff. These tests close
// that gap for the one route that has been converted so far; each further
// conversion brings its own table.
// Authentication is out of the picture here: every row supplies a user, and
// what is being tested is what the route's authorization guards then do with
// them. Passport's real jwt strategy is not registered in a unit test, so it
// stands in as a subclass - the chain still refuses to run if the controller
// gains a class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

describe('CaseController - Transition guard chain', () => {
  const prosecutorsOfficeId = uuid()
  const courtId = uuid()

  const prosecutor = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    institution: {
      id: prosecutorsOfficeId,
      type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
    },
    canConfirmIndictment: false,
  } as User

  const districtCourtJudge = {
    id: uuid(),
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { id: courtId, type: InstitutionType.DISTRICT_COURT },
  } as User

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
  } as User

  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    transition: CaseTransition,
    caseId: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    // One instance per guard the chain declares, including CaseController's
    // class-level JwtAuthUserGuard, which Nest runs before the method-level
    // ones. RolesGuard gets a real Reflector so it resolves the route's rules
    // from its own metadata.
    const guards = [
      new AuthenticatedGuard(),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new RolesGuard(new Reflector()),
      new CaseWriteGuard(),
      new CaseTransitionGuard(),
    ]

    runChain = (user, transition, caseId) =>
      runInRequestContext(() =>
        runGuardChain(CaseController, 'transition', guards, {
          params: { caseId },
          user: { currentUser: user },
          body: { transition },
          case: undefined,
        }),
      )
  })

  describe('prosecutor submitting a case they can write', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.DRAFT,
      prosecutorsOfficeId,
    } as Case
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await runChain(prosecutor, CaseTransition.SUBMIT, caseId)
    })

    // This is the regression: prosecutorTransitionRule reads request.case and
    // denies outright when it is missing, so it fails the moment RolesGuard is
    // moved ahead of CaseExistsForUpdateGuard.
    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })
  })

  describe('district court judge receiving a case at their court', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.SUBMITTED,
      courtId,
    } as Case
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await runChain(districtCourtJudge, CaseTransition.RECEIVE, caseId)
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })
  })

  describe('user in a role the route has no rule for', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.DRAFT,
      prosecutorsOfficeId,
    } as Case
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await runChain(defender, CaseTransition.SUBMIT, caseId)
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(null)

      then = await runChain(prosecutor, CaseTransition.SUBMIT, caseId)
    })

    it('should be rejected by the case-exists guard before any rule runs', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
