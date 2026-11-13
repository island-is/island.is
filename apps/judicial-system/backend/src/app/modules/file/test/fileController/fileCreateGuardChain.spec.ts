import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseFileCategory,
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
import { CivilClaimantExistsGuard } from '../../../defendant/guards/civilClaimantExists.guard'
import { DefendantExistsGuard } from '../../../defendant/guards/defendantExists.guard'
import {
  AppealCase,
  Case,
  CaseRepositoryService,
  CivilClaimant,
  Defendant,
  EventLog,
} from '../../../repository'
import { FileController } from '../../file.controller'
import { CreateCivilClaimantCaseFileGuard } from '../../guards/createCivilClaimantCaseFile.guard'
import { CreateDefendantCaseFileGuard } from '../../guards/createDefendantCaseFile.guard'

// The guards of the three routes that create a file, executed rather than
// merely declared.
//
// The per-route *Guards.spec.ts pin the declared order and
// fileCreateRolesRules.spec.ts pins that no rule on these routes reads the
// case. Neither runs a guard, and a wrong order is not visible anywhere else:
// guards do not execute in controller unit tests, so a chain that locks the
// case row for every authenticated caller - or one that never reads the case
// the guards after it depend on - passes the whole suite. This table runs
// them, in Nest's order, for every user role on each route.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const prosecutorsOfficeId = uuid()
const publicProsecutorsOfficeId = uuid()
const courtId = uuid()
const courtOfAppealsId = uuid()
const defendantId = uuid()
const civilClaimantId = uuid()

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

// The routes that name a defendant or a civil claimant find them on the case
// the guard loaded.
const withParties = (theCase: Case) =>
  ({
    ...theCase,
    defendants: [{ id: defendantId, caseId: theCase.id } as Defendant],
    civilClaimants: [
      { id: civilClaimantId, caseId: theCase.id } as CivilClaimant,
    ],
  } as Case)

const draftIndictmentAtOffice = (caseId: string) =>
  withParties({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.DRAFT,
    prosecutorsOfficeId,
  } as Case)

const receivedIndictmentAtCourt = (caseId: string) =>
  withParties({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
    courtId,
  } as Case)

const completedIndictmentSentToPublicProsecutor = (caseId: string) =>
  withParties({
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
  withParties({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    verdictAppealCase: { id: uuid() } as AppealCase,
  } as Case)

// One row per allowed role: the user, a body the route's category guard lets
// them send and a case they can write.
type AllowedRow = [
  UserRole,
  User,
  Record<string, unknown>,
  (caseId: string) => Case,
]

const prosecutionRoles = [
  UserRole.PROSECUTOR,
  UserRole.PROSECUTOR_REPRESENTATIVE,
]
const districtCourtRoles = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]
const courtOfAppealsRoles = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]

const prosecutionRows = (body: Record<string, unknown>): AllowedRow[] =>
  prosecutionRoles.map((role) => [
    role,
    prosecutionUser(role),
    body,
    draftIndictmentAtOffice,
  ])
const districtCourtRows = (body: Record<string, unknown>): AllowedRow[] =>
  districtCourtRoles.map((role) => [
    role,
    courtUser(role),
    body,
    receivedIndictmentAtCourt,
  ])
const courtOfAppealsRows = (body: Record<string, unknown>): AllowedRow[] =>
  courtOfAppealsRoles.map((role) => [
    role,
    courtOfAppealsUser(role),
    body,
    indictmentWithAppealedVerdict,
  ])
const publicProsecutorStaffRow = (
  body: Record<string, unknown>,
): AllowedRow => [
  UserRole.PUBLIC_PROSECUTOR_STAFF,
  publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
  body,
  completedIndictmentSentToPublicProsecutor,
]

const caseFileBody = { category: CaseFileCategory.PROSECUTOR_CASE_FILE }
const criminalRecordBody = { category: CaseFileCategory.CRIMINAL_RECORD }
const civilClaimBody = { category: CaseFileCategory.CIVIL_CLAIM }
const verdictAppealStatementBody = {
  category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
}

// A rejection by a guard after the locking read, for a prosecutor on a draft
// indictment at their own office.
interface AfterReadRejection {
  name: string
  params?: Record<string, string>
  body?: Record<string, unknown>
  rejectedBy: string
  error: new (...args: never[]) => Error
}

interface Route {
  method: string
  params: Record<string, string>
  allowed: AllowedRow[]
  afterRead: AfterReadRejection[]
}

const routes: Route[] = [
  {
    method: 'createCaseFile',
    params: {},
    allowed: [
      ...prosecutionRows(caseFileBody),
      ...districtCourtRows(caseFileBody),
      ...courtOfAppealsRows(caseFileBody),
      publicProsecutorStaffRow(caseFileBody),
    ],
    afterRead: [],
  },
  {
    method: 'createDefendantCaseFile',
    params: { defendantId },
    allowed: [
      ...prosecutionRows(criminalRecordBody),
      ...courtOfAppealsRows(verdictAppealStatementBody),
      publicProsecutorStaffRow(criminalRecordBody),
    ],
    afterRead: [
      {
        name: 'defendant is not on the case',
        params: { defendantId: uuid() },
        rejectedBy: DefendantExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'category the prosecutor may not file on a defendant',
        body: verdictAppealStatementBody,
        rejectedBy: CreateDefendantCaseFileGuard.name,
        error: ForbiddenException,
      },
    ],
  },
  {
    method: 'createCivilClaimantCaseFile',
    params: { civilClaimantId },
    allowed: [
      ...prosecutionRows(civilClaimBody),
      ...courtOfAppealsRows(verdictAppealStatementBody),
      publicProsecutorStaffRow(civilClaimBody),
    ],
    afterRead: [
      {
        name: 'civil claimant is not on the case',
        params: { civilClaimantId: uuid() },
        rejectedBy: CivilClaimantExistsGuard.name,
        error: NotFoundException,
      },
      {
        name: 'category the prosecutor may not file on a civil claimant',
        body: verdictAppealStatementBody,
        rejectedBy: CreateCivilClaimantCaseFileGuard.name,
        error: ForbiddenException,
      },
    ],
  },
]

describe.each(routes.map((route) => [route.method, route] as const))(
  'FileController - %s guard chain',
  (methodName, { params, allowed, afterRead }) => {
    const allowedRoles = allowed.map(([role]) => role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )
    const prosecutorBody = allowed[0][2]

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let mockSequelize: Sequelize
    let runChain: (
      user: User,
      caseId: string,
      body: Record<string, unknown>,
      overrideParams?: Record<string, string>,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    // Both reads are primed, so a route making the plain one fails on the
    // assertion below rather than on a missing case.
    const primeCase = (theCase: Case | null) => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)
    }

    // The lock lives in the request transaction, which only the locking read
    // opens - and it is the only read of the case the chain makes.
    const expectTheLockingRead = (caseId: string) => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
      expect(mockCaseRepositoryService.findLiveById).not.toHaveBeenCalled()
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    }

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService
      mockSequelize = sequelize

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class, including the
      // controller's class-level JwtAuthUserGuard, which Nest runs before the
      // method-level ones. RolesGuard gets a real Reflector so it resolves
      // the route's rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new DefendantExistsGuard(),
        new CivilClaimantExistsGuard(),
        new CreateDefendantCaseFileGuard(),
        new CreateCivilClaimantCaseFileGuard(),
      ]

      runChain = (user, caseId, body, overrideParams = {}) =>
        runInRequestContext(() =>
          runGuardChain(FileController, methodName, guards, {
            params: { caseId, ...params, ...overrideParams },
            user: { currentUser: user },
            body,
            case: undefined,
          }),
        )
    })

    describe.each(allowed)(
      '%s on a case they can write',
      (_role, user, body, caseFor) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          primeCase(caseFor(caseId))

          then = await runChain(user, caseId, body)
        })

        it('should let the whole chain through', () => {
          expect(then.error).toBeUndefined()
          expect(then.rejectedBy).toBeUndefined()
          expect(then.allowed).toBe(true)
        })

        it('should read the case under the request transaction', () => {
          expectTheLockingRead(caseId)
        })
      },
    )

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(draftIndictmentAtOffice(caseId))

        then = await runChain(prosecutionUser(role), caseId, prosecutorBody)
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of putting RolesGuard ahead of the read: this caller is
      // turned away before the case is read, so no FOR UPDATE lock is taken
      // on its behalf. Both repository stubs are primed with a case above, so
      // this fails if a read happens - rather than passing because the read
      // would have failed anyway.
      it('should not read the case', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).not.toHaveBeenCalled()
        expect(mockCaseRepositoryService.findLiveById).not.toHaveBeenCalled()
        expect(mockSequelize.transaction).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR),
          caseId,
          prosecutorBody,
        )
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The write guard and the two party guards decide from request.case. Each
    // of them throws a 500 or a 400 for a missing case and a 403 or 404 for
    // the case it was given, so the error type is what shows the read came
    // first. The two category guards decide from the user and the body
    // alone, so their rows below rely on the read assertion instead.
    describe("prosecutor at another office than the case's", () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(draftIndictmentAtOffice(caseId))

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR, uuid()),
          caseId,
          prosecutorBody,
        )
      })

      it('should be rejected by CaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case under the request transaction first', () => {
        expectTheLockingRead(caseId)
      })
    })

    if (afterRead.length > 0) {
      describe.each(afterRead.map((row) => [row.name, row] as const))(
        '%s',
        (_name, { params: overrideParams, body, rejectedBy, error }) => {
          const caseId = uuid()
          let then: Awaited<ReturnType<typeof runChain>>

          beforeEach(async () => {
            primeCase(draftIndictmentAtOffice(caseId))

            then = await runChain(
              prosecutionUser(UserRole.PROSECUTOR),
              caseId,
              body ?? prosecutorBody,
              overrideParams,
            )
          })

          it(`should be rejected by ${rejectedBy}`, () => {
            expect(then.allowed).toBe(false)
            expect(then.rejectedBy).toBe(rejectedBy)
            expect(then.error).toBeInstanceOf(error)
          })

          it('should have read the case under the request transaction first', () => {
            expectTheLockingRead(caseId)
          })
        },
      )
    }
  },
)
