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

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseExistsForUpdateGuard } from '../../../case/guards/caseExistsForUpdate.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import {
  AppealCase,
  Case,
  CaseRepositoryService,
  Defendant,
  EventLog,
} from '../../../repository'
import { DefendantController } from '../../defendant.controller'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'

// Every route's guards, executed rather than merely declared.
//
// defendantControllerGuards.spec.ts pins the declared order and
// defendantRolesRules.spec.ts pins that no rule on any route reads the case.
// Neither runs a guard, and a wrong order here is not visible anywhere else:
// guards do not execute in controller unit tests, so a chain that locks the
// case row for every authenticated caller - or one that never reads the case
// the guards after it depend on - passes the whole suite. This table runs
// them, in Nest's order, for every user role on every route.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

// One row per allowed role: the user, a body their rule lets through and a
// case they can write. The court of appeals rules are field rules, so the
// body is part of what lets those rows through - a judge there sending a
// district court field is a rejection, below.
type AllowedRow = [
  UserRole,
  User,
  Partial<UpdateDefendantDto>,
  (caseId: string) => Case,
]

const prosecutorsOfficeId = uuid()
const publicProsecutorsOfficeId = uuid()
const courtId = uuid()
const courtOfAppealsId = uuid()
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
const courtOfAppealsUser = (role: UserRole) =>
  userAt(role, courtOfAppealsId, InstitutionType.COURT_OF_APPEALS)

// The routes that name a defendant find it on the case the guard loaded.
const withDefendant = (theCase: Case) =>
  ({
    ...theCase,
    defendants: [{ id: defendantId, caseId: theCase.id } as Defendant],
  } as Case)

const draftIndictmentAtOffice = (caseId: string) =>
  withDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.DRAFT,
    prosecutorsOfficeId,
  } as Case)

const receivedIndictmentAtCourt = (caseId: string) =>
  withDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
    courtId,
  } as Case)

const completedIndictmentSentToPublicProsecutor = (caseId: string) =>
  withDefendant({
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

const indictmentWithAppealedVerdict = (caseId: string) =>
  withDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    verdictAppealCase: { id: uuid() } as AppealCase,
  } as Case)

const defendantBody: Partial<UpdateDefendantDto> = { noNationalId: true }
const courtOfAppealsBody: Partial<UpdateDefendantDto> = {
  isAppealDefenderConfirmed: true,
}
const districtCourtBody: Partial<UpdateDefendantDto> = {
  isDefenderChoiceConfirmed: true,
}

const prosecutionRows: AllowedRow[] = [
  [
    UserRole.PROSECUTOR,
    prosecutionUser(UserRole.PROSECUTOR),
    defendantBody,
    draftIndictmentAtOffice,
  ],
  [
    UserRole.PROSECUTOR_REPRESENTATIVE,
    prosecutionUser(UserRole.PROSECUTOR_REPRESENTATIVE),
    defendantBody,
    draftIndictmentAtOffice,
  ],
]

const updateRows: AllowedRow[] = [
  ...prosecutionRows,
  [
    UserRole.DISTRICT_COURT_JUDGE,
    courtUser(UserRole.DISTRICT_COURT_JUDGE),
    defendantBody,
    receivedIndictmentAtCourt,
  ],
  [
    UserRole.DISTRICT_COURT_REGISTRAR,
    courtUser(UserRole.DISTRICT_COURT_REGISTRAR),
    defendantBody,
    receivedIndictmentAtCourt,
  ],
  [
    UserRole.DISTRICT_COURT_ASSISTANT,
    courtUser(UserRole.DISTRICT_COURT_ASSISTANT),
    defendantBody,
    receivedIndictmentAtCourt,
  ],
  [
    UserRole.PUBLIC_PROSECUTOR_STAFF,
    publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
    defendantBody,
    completedIndictmentSentToPublicProsecutor,
  ],
  [
    UserRole.COURT_OF_APPEALS_JUDGE,
    courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
    courtOfAppealsBody,
    indictmentWithAppealedVerdict,
  ],
  [
    UserRole.COURT_OF_APPEALS_REGISTRAR,
    courtOfAppealsUser(UserRole.COURT_OF_APPEALS_REGISTRAR),
    courtOfAppealsBody,
    indictmentWithAppealedVerdict,
  ],
  [
    UserRole.COURT_OF_APPEALS_ASSISTANT,
    courtOfAppealsUser(UserRole.COURT_OF_APPEALS_ASSISTANT),
    courtOfAppealsBody,
    indictmentWithAppealedVerdict,
  ],
]

// The routes that name a defendant run DefendantExistsGuard after the
// class-level chain; create does not.
const routes: [string, boolean, AllowedRow[]][] = [
  ['create', false, prosecutionRows],
  ['update', true, updateRows],
  ['delete', true, prosecutionRows],
]

describe.each(routes)(
  'DefendantController - %s guard chain',
  (methodName, namesDefendant, allowedRows) => {
    const allowedRoles = allowedRows.map(([role]) => role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

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

      // One instance per guard the chain declares as a class. RolesGuard gets
      // a real Reflector so it resolves the route's rules from its own
      // metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new DefendantExistsGuard(),
      ]

      runChain = (user, caseId, body, requestedDefendantId = defendantId) =>
        runInRequestContext(() =>
          runGuardChain(DefendantController, methodName, guards, {
            params: namesDefendant
              ? { caseId, defendantId: requestedDefendantId }
              : { caseId },
            user: { currentUser: user },
            body,
            case: undefined,
          }),
        )
    })

    describe.each(allowedRows)(
      '%s on a case they can write',
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

        then = await runChain(prosecutionUser(role), caseId, defendantBody)
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

    if (methodName === 'update') {
      // The court of appeals rules are field rules, so the body is part of
      // the decision RolesGuard makes before the lock: a role the route
      // knows, sending a field its rule does not allow, is also turned away
      // without a read.
      describe('court of appeals judge updating a district court field', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            indictmentWithAppealedVerdict(caseId),
          )

          then = await runChain(
            courtOfAppealsUser(UserRole.COURT_OF_APPEALS_JUDGE),
            caseId,
            districtCourtBody,
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
    }

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
          defendantBody,
        )
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the locking read all decide from request.case. Each
    // of them throws a 500 for a missing case and a 403 or 404 for the case
    // it was given, so the error type is what shows the read came first.
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
          defendantBody,
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

    if (namesDefendant) {
      describe('defendant is not on the case', () => {
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
            defendantBody,
            uuid(),
          )
        })

        // DefendantExistsGuard looks the defendant up among the case's own
        // defendants, which is the row the handler then changes - both see
        // the locked case.
        it('should be rejected by DefendantExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(DefendantExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }
  },
)
