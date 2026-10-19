import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RouteRolesGuard,
} from '@island.is/judicial-system/auth'
import {
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  AppealEventType,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  EventType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseExistsForUpdateGuard } from '../../case/guards/caseExistsForUpdate.guard'
import { CaseWriteGuard } from '../../case/guards/caseWrite.guard'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CaseRepositoryService,
  EventLog,
} from '../../repository'
import { AppealCaseController } from '../appealCase.controller'
import { AppealCaseExistsGuard } from '../guards/appealCaseExists.guard'

// The guards of the four appeal case routes converted to the guard-owned
// transaction, executed rather than merely declared.
//
// transitionRolesRules.spec.ts pins what the rules decide from a request that
// CaseExistsForUpdateGuard and AppealCaseExistsGuard have already populated.
// It never runs a guard, and a wrong order is not visible anywhere else:
// guards do not execute in controller unit tests, so a chain that locks the
// case row for every authenticated caller - or one that lets RolesGuard decide
// before the case it reads is there - passes the whole suite. This table runs
// them, in Nest's order, for every user role on each of the four routes.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const courtId = uuid()
const prosecutorsOfficeId = uuid()
const publicProsecutorsOfficeId = uuid()
const appealCaseId = uuid()

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
const districtCourtUser = (role: UserRole) =>
  userAt(role, courtId, InstitutionType.DISTRICT_COURT)
const courtOfAppealsUser = (role: UserRole) =>
  userAt(role, uuid(), InstitutionType.COURT_OF_APPEALS)

// A case-level ruling appeal the prosecution made, received by the court of
// appeals: the prosecution may withdraw it, the district court has received
// it, and the court of appeals may work on it.
const rulingAppealBy = (appellant: UserRole) =>
  ({
    id: appealCaseId,
    appealType: AppealCaseType.RULING,
    appealState: AppealCaseState.RECEIVED,
    appealEventLogs: [
      {
        eventType: AppealEventType.APPEALED,
        userRole: appellant,
      } as AppealEventLog,
    ],
  } as AppealCase)

// Writable by a prosecutor at the office, by the district court that has it
// and by the court of appeals that received its appeal.
const appealedCustodyCase = (caseId: string, appellant = UserRole.PROSECUTOR) =>
  ({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    prosecutorsOfficeId,
    courtId,
    appealCase: rulingAppealBy(appellant),
  } as Case)

// A prosecutor representative only writes indictment cases.
const appealedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
    prosecutorsOfficeId,
    courtId,
    appealCase: rulingAppealBy(UserRole.PROSECUTOR),
  } as Case)

// The public prosecution office writes a completed indictment case that has
// been sent to it, and only acts on verdict appeals.
const verdictAppealedIndictmentCase = (caseId: string) =>
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
    verdictAppealCase: {
      id: appealCaseId,
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.APPEALED,
      appealEventLogs: [
        {
          eventType: AppealEventType.APPEALED,
          userRole: UserRole.DEFENDER,
        } as AppealEventLog,
      ],
    } as AppealCase,
  } as Case)

// One row per allowed role: the user, a case they can write and a body their
// rule on the route admits.
type AllowedRow = [UserRole, User, (caseId: string) => Case, object]

const courtOfAppealsRoles = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]

const prosecutionRows = (body: object): AllowedRow[] => [
  [
    UserRole.PROSECUTOR,
    prosecutionUser(UserRole.PROSECUTOR),
    appealedCustodyCase,
    body,
  ],
  [
    UserRole.PROSECUTOR_REPRESENTATIVE,
    prosecutionUser(UserRole.PROSECUTOR_REPRESENTATIVE),
    appealedIndictmentCase,
    body,
  ],
]

const publicProsecutionRow = (body: object): AllowedRow => [
  UserRole.PUBLIC_PROSECUTOR_STAFF,
  publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
  verdictAppealedIndictmentCase,
  body,
]

const courtOfAppealsRows = (body: object): AllowedRow[] =>
  courtOfAppealsRoles.map((role) => [
    role,
    courtOfAppealsUser(role),
    appealedCustodyCase,
    body,
  ])

const districtCourtRows = (body: object): AllowedRow[] =>
  [UserRole.DISTRICT_COURT_JUDGE, UserRole.DISTRICT_COURT_REGISTRAR].map(
    (role) => [role, districtCourtUser(role), appealedCustodyCase, body],
  )

const createRows: AllowedRow[] = [
  ...prosecutionRows({}),
  publicProsecutionRow({ appealType: AppealCaseType.VERDICT }),
]

const updateRows: AllowedRow[] = [
  ...prosecutionRows({ requestAppealRulingNotToBePublished: true }),
  ...courtOfAppealsRows({ appealCaseNumber: '1/2026' }),
]

const createEventLogRows: AllowedRow[] = prosecutionRows({
  eventType: AppealEventType.APPEAL_STATEMENT_SENT,
})

const transitionRows: AllowedRow[] = [
  ...prosecutionRows({ transition: AppealCaseTransition.WITHDRAW_APPEAL }),
  publicProsecutionRow({ transition: AppealCaseTransition.WITHDRAW_APPEAL }),
  ...districtCourtRows({ transition: AppealCaseTransition.RECEIVE_APPEAL }),
  ...courtOfAppealsRows({ transition: AppealCaseTransition.COMPLETE_APPEAL }),
]

// Whether the route names an appeal case, and so declares
// AppealCaseExistsGuard after the locking read.
const routes: [string, boolean, AllowedRow[]][] = [
  ['create', false, createRows],
  ['update', true, updateRows],
  ['createEventLog', true, createEventLogRows],
  ['transition', true, transitionRows],
]

describe.each(routes)(
  'AppealCaseController - %s guard chain',
  (methodName, namesAppealCase, allowedRows) => {
    const allowedRoles = allowedRows.map(([role]) => role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    // The body the prosecutor's rule on this route admits - the rows below
    // that are not about the rules use it.
    const prosecutorBody = allowedRows[0][3]

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let runChain: (
      user: User,
      caseId: string,
      body: object,
      requestedAppealCaseId?: string,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class, including the
      // controller's class-level JwtAuthUserGuard, which Nest runs before the
      // method-level ones. RouteRolesGuard and RolesGuard get a real Reflector
      // so they resolve the route's rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RouteRolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new AppealCaseExistsGuard(),
        new RolesGuard(new Reflector()),
        new CaseWriteGuard(),
      ]

      runChain = (user, caseId, body, requestedAppealCaseId = appealCaseId) =>
        runInRequestContext(() =>
          runGuardChain(AppealCaseController, methodName, guards, {
            params: namesAppealCase
              ? { caseId, appealCaseId: requestedAppealCaseId }
              : { caseId },
            user: { currentUser: user },
            body,
            case: undefined,
          }),
        )
    })

    describe.each(allowedRows)(
      '%s on a case they can write',
      (_role, user, caseFor, body) => {
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
          appealedCustodyCase(caseId),
        )

        then = await runChain(
          userAt(role, uuid(), InstitutionType.DISTRICT_COURT),
          caseId,
          prosecutorBody,
        )
      })

      it('should be rejected by RouteRolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RouteRolesGuard.name)
      })

      // The point of the pre-filter: this caller is turned away before the
      // case is read, so no FOR UPDATE lock is taken on its behalf. The
      // repository stub is primed with a case above, so this fails if the
      // read happens - rather than passing because the read would have
      // failed anyway.
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
          prosecutorBody,
        )
      })

      it('should be rejected by the case-exists guard before any rule runs', () => {
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
          appealedCustodyCase(caseId),
        )

        then = await runChain(
          prosecutionUser(UserRole.PROSECUTOR, uuid()),
          caseId,
          prosecutorBody,
        )
      })

      // What the pre-filter leaves: a caller in a listed role on a case they
      // cannot write reaches the locking read, and is turned away by
      // CaseWriteGuard from the case it read.
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

    if (namesAppealCase) {
      describe('appeal case is not on the locked case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            appealedCustodyCase(caseId),
          )

          then = await runChain(
            prosecutionUser(UserRole.PROSECUTOR),
            caseId,
            prosecutorBody,
            uuid(),
          )
        })

        // AppealCaseExistsGuard looks the appeal case up among the case's
        // own appeals, which is where the handler's appeal case then comes
        // from - both see the locked case.
        it('should be rejected by AppealCaseExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(AppealCaseExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })

        it('should have read the case under the request transaction first', () => {
          expect(
            mockCaseRepositoryService.findLiveByIdForUpdate,
          ).toHaveBeenCalledWith(caseId, transaction)
        })
      })
    }
  },
)

// RolesGuard stays after the locking read because the rules it applies read
// the request's case and appeal case. These two rows are the ones that would
// break if it were moved ahead of the read: they decide from what the read
// put on the request.
describe('AppealCaseController - rules that read the locked case', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    methodName: string,
    user: User,
    caseId: string,
    body: object,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new AuthenticatedGuard(),
      new RouteRolesGuard(new Reflector()),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new AppealCaseExistsGuard(),
      new RolesGuard(new Reflector()),
      new CaseWriteGuard(),
    ]

    runChain = (methodName, user, caseId, body) =>
      runInRequestContext(() =>
        runGuardChain(AppealCaseController, methodName, guards, {
          params: { caseId, appealCaseId },
          user: { currentUser: user },
          body,
          case: undefined,
        }),
      )
  })

  describe('prosecutor withdrawing an appeal the defence made', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        appealedCustodyCase(caseId, UserRole.DEFENDER),
      )

      then = await runChain(
        'transition',
        prosecutionUser(UserRole.PROSECUTOR),
        caseId,
        { transition: AppealCaseTransition.WITHDRAW_APPEAL },
      )
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  describe('public prosecution office withdrawing a ruling appeal', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce({
        ...verdictAppealedIndictmentCase(caseId),
        verdictAppealCase: undefined,
        appealCase: rulingAppealBy(UserRole.PROSECUTOR),
      } as Case)

      then = await runChain(
        'transition',
        publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
        caseId,
        { transition: AppealCaseTransition.WITHDRAW_APPEAL },
      )
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })
})
