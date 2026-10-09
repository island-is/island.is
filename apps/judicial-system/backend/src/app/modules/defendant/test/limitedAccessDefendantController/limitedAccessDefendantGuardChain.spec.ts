import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentCaseReviewDecision,
  InstitutionType,
  PunishmentType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseExistsForUpdateGuard } from '../../../case/guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

// The update route's guards, executed rather than merely declared.
//
// limitedAccessDefendantControllerGuards.spec.ts pins the declared order and
// limitedAccessDefendantRolesRules.spec.ts pins that the route's rule does
// not read the case. Neither runs a guard, and a wrong order here is not
// visible anywhere else: guards do not execute in controller unit tests, so a
// chain that locks the case row for every authenticated caller - or one that
// never reads the case the guards after it depend on - passes the whole
// suite. This table runs them, in Nest's order, for every user role.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

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
    institution: { id: institutionId, type: institutionType },
  } as User)

const prisonAdminUser = () =>
  userAt(
    UserRole.PRISON_SYSTEM_STAFF,
    prisonAdminId,
    InstitutionType.PRISON_ADMIN,
  )
const prisonStaffUser = () =>
  userAt(UserRole.PRISON_SYSTEM_STAFF, prisonId, InstitutionType.PRISON)

// The prison admin may write to an indictment case once it has a ruling and a
// defendant the prosecution has sent them without appealing - which is also
// the defendant the route names, found on the case the guard loaded.
const indictmentSentToPrisonAdmin = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    defendants: [
      {
        id: defendantId,
        caseId,
        isSentToPrisonAdmin: true,
        indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
      } as Defendant,
    ],
  } as Case)

// The same indictment case before the prosecution has sent the defendant to
// the prison admin: the prison admin may not write to it yet.
const indictmentNotSentToPrisonAdmin = (caseId: string) =>
  ({
    ...indictmentSentToPrisonAdmin(caseId),
    defendants: [
      {
        id: defendantId,
        caseId,
        isSentToPrisonAdmin: false,
        indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
      } as Defendant,
    ],
  } as Case)

// A custody case - not an indictment case, so CaseTypeGuard rejects it before
// CaseWriteGuard gets to decide.
const acceptedCustodyCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    defendants: [{ id: defendantId, caseId } as Defendant],
  } as Case)

const prisonAdminBody: Partial<UpdateDefendantDto> = {
  punishmentType: PunishmentType.IMPRISONMENT,
}
const prosecutionBody: Partial<UpdateDefendantDto> = { noNationalId: true }

const rejectedRoles = Object.values(UserRole).filter(
  (role) => role !== UserRole.PRISON_SYSTEM_STAFF,
)

describe('LimitedAccessDefendantController - update guard chain', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
    body: Partial<UpdateDefendantDto>,
    requestedDefendantId?: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    // One instance per guard the chain declares as a class. RolesGuard gets a
    // real Reflector so it resolves the route's rules from its own metadata.
    // CaseTypeGuard is declared as a configured instance and carries its own
    // allowed case types.
    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new CaseWriteGuard(),
      new DefendantExistsGuard(),
    ]

    runChain = (user, caseId, body, requestedDefendantId = defendantId) =>
      runInRequestContext(() =>
        runGuardChain(LimitedAccessDefendantController, 'update', guards, {
          params: { caseId, defendantId: requestedDefendantId },
          user: { currentUser: user },
          body,
          case: undefined,
        }),
      )
  })

  describe('prison admin on a case sent to them', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentSentToPrisonAdmin(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, prisonAdminBody)
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
        indictmentSentToPrisonAdmin(caseId),
      )

      then = await runChain(
        userAt(role, prisonAdminId, InstitutionType.PRISON_ADMIN),
        caseId,
        prisonAdminBody,
      )
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

  // The rule is a field rule, so the body is part of the decision RolesGuard
  // makes before the lock: the role the route knows, sending a field its rule
  // does not allow, is also turned away without a read.
  describe('prison admin sending a field outside their rule', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentSentToPrisonAdmin(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, prosecutionBody)
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

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

      then = await runChain(prisonAdminUser(), caseId, prisonAdminBody)
    })

    it('should be rejected by the case-exists guard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  // The guards after the locking read all decide from request.case. Each of
  // them throws a 500 for a missing case and a 403 or 404 for the case it was
  // given, so the error type is what shows the read came first.
  describe('case is not an indictment case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        acceptedCustodyCase(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, prisonAdminBody)
    })

    it('should be rejected by CaseTypeGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseTypeGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  // The prison admin's write access is a fact about the case - that the
  // prosecution has sent them the defendant - and that is decided from the
  // locked case.
  describe('prison admin on a case not yet sent to them', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentNotSentToPrisonAdmin(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, prisonAdminBody)
    })

    it('should be rejected by CaseWriteGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseWriteGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  // Prison staff share the role with the prison admin, so the rule lets them
  // through; it is the case's write access that turns them away, and that is
  // decided from the locked case.
  describe('prison staff at a prison', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentSentToPrisonAdmin(caseId),
      )

      then = await runChain(prisonStaffUser(), caseId, prisonAdminBody)
    })

    it('should be rejected by CaseWriteGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseWriteGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  describe('defendant is not on the case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        indictmentSentToPrisonAdmin(caseId),
      )

      then = await runChain(prisonAdminUser(), caseId, prisonAdminBody, uuid())
    })

    // DefendantExistsGuard looks the defendant up among the case's own
    // defendants, which is the row the handler then changes - both see the
    // locked case.
    it('should be rejected by DefendantExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(DefendantExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
