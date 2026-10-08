import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  JwtAuthUserGuard,
  RolesGuard,
  TokenGuard,
} from '@island.is/judicial-system/auth'
import {
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
import { CaseCompletedGuard } from '../../case/guards/caseCompleted.guard'
import { CaseExistsForUpdateGuard } from '../../case/guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../case/guards/caseWrite.guard'
import { DefendantExistsGuard } from '../../defendant/guards/defendantExists.guard'
import { DefendantNationalIdExistsGuard } from '../../defendant/guards/defendantNationalIdExists.guard'
import {
  Case,
  CaseRepositoryService,
  Defendant,
  EventLog,
  Verdict,
} from '../../repository'
import { ExternalPoliceVerdictExistsGuard } from '../guards/ExternalPoliceVerdictExists.guard'
import { VerdictExistsGuard } from '../guards/verdictExists.guard'
import { InternalVerdictController } from '../internalVerdict.controller'
import { VerdictController } from '../verdict.controller'
import { VerdictService } from '../verdict.service'

// The guards of the five verdict routes converted to the guard-owned
// transaction, executed rather than merely declared.
//
// verdictControllerGuards.spec.ts and internalVerdictControllerGuards.spec.ts
// pin the declared order and verdictRolesRules.spec.ts pins that no rule on
// the converted routes reads the case. Neither runs a guard, and a wrong order
// here is not visible anywhere else: guards do not execute in controller unit
// tests, so a chain that locks the case row for every authenticated caller -
// or one that never reads the case the guards after it depend on - passes the
// whole suite. This table runs them, in Nest's order, for every user role on
// the three VerdictController routes, and for the two internal routes behind
// the token guard.
//
// Authentication is out of the picture on the user routes: every row supplies
// a user, and what is tested is what the route's authorization guards do with
// them. Passport's real jwt strategy is not registered in a unit test, so it
// stands in as a subclass - the chain still refuses to run if the controller
// gains a class-level guard this spec does not account for. The internal
// routes run the real TokenGuard: it decides from a header alone, so it is
// cheap to run and the row that sends the wrong token proves the lock is not
// taken on an unauthenticated caller's behalf.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const courtId = uuid()
const publicProsecutorsOfficeId = uuid()
const defendantId = uuid()
const defendantNationalId = '0101010000'
const secretToken = uuid()

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

const prosecutionUser = (role: UserRole) =>
  userAt(role, uuid(), InstitutionType.POLICE_PROSECUTORS_OFFICE)
const publicProsecutionUser = (role: UserRole) =>
  userAt(
    role,
    publicProsecutorsOfficeId,
    InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
const courtUser = (role: UserRole, institutionId = courtId) =>
  userAt(role, institutionId, InstitutionType.DISTRICT_COURT)

// The routes that name a defendant find it on the case the guard loaded, and
// the verdict guards find the defendant's latest verdict there too.
const withServedDefendant = (theCase: Case) =>
  ({
    ...theCase,
    defendants: [
      {
        id: defendantId,
        caseId: theCase.id,
        nationalId: defendantNationalId,
        verdicts: [
          {
            id: uuid(),
            caseId: theCase.id,
            defendantId,
            created: new Date(),
          } as Verdict,
        ],
      } as Defendant,
    ],
  } as Case)

const withUnservedDefendant = (theCase: Case) =>
  ({
    ...theCase,
    defendants: [
      {
        id: defendantId,
        caseId: theCase.id,
        nationalId: defendantNationalId,
        verdicts: [],
      } as unknown as Defendant,
    ],
  } as Case)

const completedIndictmentAtCourt = (caseId: string) =>
  withServedDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    courtId,
  } as Case)

const receivedIndictmentAtCourt = (caseId: string) =>
  withServedDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
    courtId,
  } as Case)

const completedIndictmentSentToPublicProsecutor = (caseId: string) =>
  withServedDefendant({
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

// One row per allowed role: the user and a case they can write.
type AllowedRow = [UserRole, User, (caseId: string) => Case]

const courtRows: AllowedRow[] = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
].map((role) => [role, courtUser(role), completedIndictmentAtCourt])

const updateRows: AllowedRow[] = [
  ...courtRows,
  [
    UserRole.PUBLIC_PROSECUTOR_STAFF,
    publicProsecutionUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
    completedIndictmentSentToPublicProsecutor,
  ],
]

// Which of the guards after the locking read each route declares: update
// names a defendant, and update and deliverCaseVerdict need a completed case.
const routes: [string, boolean, boolean, AllowedRow[]][] = [
  ['createVerdicts', false, false, courtRows],
  ['update', true, true, updateRows],
  ['deliverCaseVerdict', false, true, courtRows],
]

describe.each(routes)(
  'VerdictController - %s guard chain',
  (methodName, namesDefendant, requiresCompleted, allowedRows) => {
    const allowedRoles = allowedRows.map(([role]) => role)
    const rejectedRoles = Object.values(UserRole).filter(
      (role) => !allowedRoles.includes(role),
    )

    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let runChain: (
      user: User,
      caseId: string,
      requestedDefendantId?: string,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class, including the
      // controller's class-level JwtAuthUserGuard and RolesGuard, which Nest
      // runs before the method-level ones. CaseTypeGuard is declared as a
      // configured instance and carries its own allowed case types. RolesGuard
      // gets a real Reflector so it resolves the route's rules from its own
      // metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new DefendantExistsGuard(),
        new VerdictExistsGuard(),
        new CaseCompletedGuard(),
      ]

      runChain = (user, caseId, requestedDefendantId = defendantId) =>
        runInRequestContext(() =>
          runGuardChain(VerdictController, methodName, guards, {
            params: namesDefendant
              ? { caseId, defendantId: requestedDefendantId }
              : { caseId },
            user: { currentUser: user },
            case: undefined,
          }),
        )
    })

    describe.each(allowedRows)(
      '%s on a case they can write',
      (_role, user, caseFor) => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(caseFor(caseId))

          then = await runChain(user, caseId)
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
          completedIndictmentAtCourt(caseId),
        )

        then = await runChain(prosecutionUser(role), caseId)
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of keeping RolesGuard ahead of the locking read: this caller
      // is turned away before the case is read, so no FOR UPDATE lock is taken
      // on its behalf. The repository stub is primed with a case above, so
      // this fails if the read happens - rather than passing because the read
      // would have failed anyway.
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

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
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
    describe('case is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce({
          ...completedIndictmentAtCourt(caseId),
          type: CaseType.CUSTODY,
        } as Case)

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
      })

      // CaseTypeGuard moved to route level with the exists guard, since it
      // decides from request.case - so it can only reach this verdict after
      // the locking read has put the case there.
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

    describe("district court judge at another court than the case's", () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          completedIndictmentAtCourt(caseId),
        )

        then = await runChain(
          courtUser(UserRole.DISTRICT_COURT_JUDGE, uuid()),
          caseId,
        )
      })

      it('should be rejected by CaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
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
            completedIndictmentAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
            uuid(),
          )
        })

        // DefendantExistsGuard looks the defendant up among the case's own
        // defendants, which is where the handler's verdict then comes from -
        // both see the locked case.
        it('should be rejected by DefendantExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(DefendantExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })

      describe('defendant has no verdict', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            withUnservedDefendant(completedIndictmentAtCourt(caseId)),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
          )
        })

        it('should be rejected by VerdictExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(VerdictExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }

    if (requiresCompleted) {
      describe('case is not completed', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            receivedIndictmentAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
          )
        })

        it('should be rejected by CaseCompletedGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(CaseCompletedGuard.name)
          expect(then.error).toBeInstanceOf(ForbiddenException)
        })
      })
    }
  },
)

describe('InternalVerdictController - updateVerdict guard chain', () => {
  const policeDocumentId = uuid()
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let mockVerdictService: VerdictService
  let runChain: (
    authorization: string | undefined,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, verdictService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockVerdictService = verdictService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new TokenGuard({ jwtSecret: '', secretToken, isConfigured: true }),
      new ExternalPoliceVerdictExistsGuard(verdictService),
      new CaseExistsForUpdateGuard(caseService, sequelize),
    ]

    // The police name the verdict rather than the case, so the request
    // carries no case id: ExternalPoliceVerdictExistsGuard supplies it.
    runChain = (authorization) =>
      runInRequestContext(() =>
        runGuardChain(InternalVerdictController, 'updateVerdict', guards, {
          params: { policeDocumentId },
          headers: { authorization },
          case: undefined,
        }),
      )
  })

  describe('police document known', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByExternalPoliceDocumentId =
        mockVerdictService.findByExternalPoliceDocumentId as jest.Mock
      mockFindByExternalPoliceDocumentId.mockResolvedValueOnce({
        id: uuid(),
        caseId,
        defendantId,
      } as Verdict)

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(caseId),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })

    // The case id the locking read uses is the one the verdict lookup put on
    // the request, so the lock lands on the verdict's own case.
    it("should read the verdict's case under the request transaction", () => {
      expect(
        mockVerdictService.findByExternalPoliceDocumentId,
      ).toHaveBeenCalledWith(policeDocumentId)
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  describe('wrong token', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByExternalPoliceDocumentId =
        mockVerdictService.findByExternalPoliceDocumentId as jest.Mock
      mockFindByExternalPoliceDocumentId.mockResolvedValueOnce({
        id: uuid(),
        caseId: uuid(),
        defendantId,
      } as Verdict)

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(uuid()),
      )

      then = await runChain(`Bearer ${uuid()}`)
    })

    it('should be rejected by TokenGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(TokenGuard.name)
      expect(then.error).toBeInstanceOf(UnauthorizedException)
    })

    // Both stubs are primed, so this fails if either lookup happens rather
    // than passing because it would have failed anyway.
    it('should neither look the verdict up nor read the case', () => {
      expect(
        mockVerdictService.findByExternalPoliceDocumentId,
      ).not.toHaveBeenCalled()
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).not.toHaveBeenCalled()
    })
  })

  describe('police document unknown', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByExternalPoliceDocumentId =
        mockVerdictService.findByExternalPoliceDocumentId as jest.Mock
      mockFindByExternalPoliceDocumentId.mockRejectedValueOnce(
        new NotFoundException(),
      )

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(uuid()),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should be rejected by ExternalPoliceVerdictExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(ExternalPoliceVerdictExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })

    it('should not read the case', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).not.toHaveBeenCalled()
    })
  })

  describe('case does not exist', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByExternalPoliceDocumentId =
        mockVerdictService.findByExternalPoliceDocumentId as jest.Mock
      mockFindByExternalPoliceDocumentId.mockResolvedValueOnce({
        id: uuid(),
        caseId: uuid(),
        defendantId,
      } as Verdict)

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(null)

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should be rejected by the case-exists guard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})

describe('InternalVerdictController - updateVerdictAppeal guard chain', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    authorization: string | undefined,
    caseId: string,
    requestedNationalId?: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    // CaseTypeGuard is declared as a configured instance and carries its own
    // allowed case types.
    const guards = [
      new TokenGuard({ jwtSecret: '', secretToken, isConfigured: true }),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new CaseCompletedGuard(),
      new DefendantNationalIdExistsGuard(),
      new VerdictExistsGuard(),
    ]

    runChain = (
      authorization,
      caseId,
      requestedNationalId = defendantNationalId,
    ) =>
      runInRequestContext(() =>
        runGuardChain(
          InternalVerdictController,
          'updateVerdictAppeal',
          guards,
          {
            params: { caseId, defendantNationalId: requestedNationalId },
            headers: { authorization },
            case: undefined,
          },
        ),
      )
  })

  describe('defendant with a verdict on a completed indictment case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(caseId),
      )

      then = await runChain(`Bearer ${secretToken}`, caseId)
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

  describe('wrong token', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(caseId),
      )

      then = await runChain(`Bearer ${uuid()}`, caseId)
    })

    it('should be rejected by TokenGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(TokenGuard.name)
      expect(then.error).toBeInstanceOf(UnauthorizedException)
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

      then = await runChain(`Bearer ${secretToken}`, caseId)
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
        ...completedIndictmentAtCourt(caseId),
        type: CaseType.CUSTODY,
      } as Case)

      then = await runChain(`Bearer ${secretToken}`, caseId)
    })

    // CaseTypeGuard decides from request.case, so it can only reach this
    // verdict after the locking read has put the case there.
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

  describe('case is not completed', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        receivedIndictmentAtCourt(caseId),
      )

      then = await runChain(`Bearer ${secretToken}`, caseId)
    })

    it('should be rejected by CaseCompletedGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseCompletedGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('no defendant with the national id on the case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        completedIndictmentAtCourt(caseId),
      )

      then = await runChain(`Bearer ${secretToken}`, caseId, '0202020000')
    })

    // DefendantNationalIdExistsGuard looks the defendant up among the case's
    // own defendants, which is where the verdict the handler writes to comes
    // from - both see the locked case.
    it('should be rejected by DefendantNationalIdExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(DefendantNationalIdExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('defendant has no verdict', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        withUnservedDefendant(completedIndictmentAtCourt(caseId)),
      )

      then = await runChain(`Bearer ${secretToken}`, caseId)
    })

    it('should be rejected by VerdictExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(VerdictExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
