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
  EventType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService, EventLog } from '../../../repository'
import { CaseController } from '../../case.controller'
import { UpdateCaseDto } from '../../dto/updateCase.dto'
import { CaseExistsForUpdateGuard } from '../../guards/caseExistsForUpdate.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

// The update route's guards, executed rather than merely declared.
//
// caseControllerGuards.spec.ts pins the declared order and
// updateRolesRules.spec.ts pins that no rule on the route reads the case.
// Neither runs a guard, and a wrong order is not visible anywhere else: guards
// do not execute in controller unit tests, so a chain that locks the case row
// for every authenticated caller - or one that never reads the case the guards
// after it depend on - passes the whole suite. This table runs them, in Nest's
// order, for every user role, on the most central mutating route in the
// system.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

describe('CaseController - Update guard chain', () => {
  const prosecutorsOfficeId = uuid()
  const publicProsecutorsOfficeId = uuid()
  const courtId = uuid()

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
  const publicProsecutionUser = (role: UserRole) =>
    userAt(
      role,
      publicProsecutorsOfficeId,
      InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    )
  const courtUser = (role: UserRole) =>
    userAt(role, courtId, InstitutionType.DISTRICT_COURT)

  // One case each allowed role can write, and one field each role's rule
  // allows. The field rules are what RolesGuard decides on, so the body is
  // part of what lets a row through - a prosecutor sending a court field is a
  // rejection, below.
  const draftIndictmentAtOffice = (caseId: string) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.DRAFT,
      prosecutorsOfficeId,
    } as Case)

  const receivedIndictmentAtCourt = (caseId: string) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      courtId,
    } as Case)

  const completedIndictmentSentToPublicProsecutor = (caseId: string) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      eventLogs: [
        {
          eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
        } as EventLog,
      ],
    } as Case)

  const prosecutionBody: Partial<UpdateCaseDto> = { description: uuid() }
  const courtBody: Partial<UpdateCaseDto> = { courtCaseNumber: 'S-1/2026' }
  const publicProsecutionBody: Partial<UpdateCaseDto> = {
    indictmentReviewerId: uuid(),
  }

  const allowedRows: [
    UserRole,
    User,
    Partial<UpdateCaseDto>,
    (caseId: string) => Case,
  ][] = [
    [
      UserRole.PROSECUTOR,
      prosecutionUser(UserRole.PROSECUTOR),
      prosecutionBody,
      draftIndictmentAtOffice,
    ],
    [
      UserRole.PROSECUTOR_REPRESENTATIVE,
      prosecutionUser(UserRole.PROSECUTOR_REPRESENTATIVE),
      prosecutionBody,
      draftIndictmentAtOffice,
    ],
    [
      UserRole.PUBLIC_PROSECUTOR_STAFF,
      publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      publicProsecutionBody,
      completedIndictmentSentToPublicProsecutor,
    ],
    [
      UserRole.DISTRICT_COURT_JUDGE,
      courtUser(UserRole.DISTRICT_COURT_JUDGE),
      courtBody,
      receivedIndictmentAtCourt,
    ],
    [
      UserRole.DISTRICT_COURT_REGISTRAR,
      courtUser(UserRole.DISTRICT_COURT_REGISTRAR),
      courtBody,
      receivedIndictmentAtCourt,
    ],
    [
      UserRole.DISTRICT_COURT_ASSISTANT,
      courtUser(UserRole.DISTRICT_COURT_ASSISTANT),
      courtBody,
      receivedIndictmentAtCourt,
    ],
  ]

  const allowedRoles = allowedRows.map(([role]) => role)
  const rejectedRoles = Object.values(UserRole).filter(
    (role) => !allowedRoles.includes(role),
  )

  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
    body: Partial<UpdateCaseDto>,
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
      new RolesGuard(new Reflector()),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new CaseWriteGuard(),
    ]

    runChain = (user, caseId, body) =>
      runInRequestContext(() =>
        runGuardChain(CaseController, 'update', guards, {
          params: { caseId },
          user: { currentUser: user },
          body,
          case: undefined,
        }),
      )
  })

  describe.each(allowedRows)(
    '%s updating a field their rule allows on a case they can write',
    (_role, user, body, caseFor) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(caseFor(caseId))

        then = await runChain(user, caseId, body)
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
    },
  )

  describe.each(rejectedRoles)('%s', (role) => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        draftIndictmentAtOffice(caseId),
      )

      then = await runChain(prosecutionUser(role), caseId, prosecutionBody)
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

  // The rules are field rules, so the body is part of the decision RolesGuard
  // makes before the lock: a role the route knows, sending a field its rule
  // does not allow, is also turned away without a read.
  describe('prosecutor updating a court field', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        draftIndictmentAtOffice(caseId),
      )

      then = await runChain(
        prosecutionUser(UserRole.PROSECUTOR),
        caseId,
        courtBody,
      )
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

      then = await runChain(
        prosecutionUser(UserRole.PROSECUTOR),
        caseId,
        prosecutionBody,
      )
    })

    it('should be rejected by the case-exists guard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  // CaseWriteGuard decides from request.case and throws a 500 when it is
  // missing, so a 403 here is what shows the locking read came first.
  describe("prosecutor at another office than the case's", () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        draftIndictmentAtOffice(caseId),
      )

      then = await runChain(
        prosecutionUser(UserRole.PROSECUTOR, uuid()),
        caseId,
        prosecutionBody,
      )
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
})
