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
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseExistsForUpdateGuard } from '../../case/guards/caseExistsForUpdate.guard'
import { CaseReadGuard } from '../../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../../case/guards/caseType.guard'
import {
  Case,
  CaseRepositoryService,
  Defendant,
  Subpoena,
} from '../../repository'
import { PoliceSubpoenaExistsGuard } from '../guards/policeSubpoenaExists.guard'
import { SubpoenaOnCaseGuard } from '../guards/subpoenaOnCase.guard'
import { InternalSubpoenaController } from '../internalSubpoena.controller'
import { SubpoenaController } from '../subpoena.controller'
import { SubpoenaService } from '../subpoena.service'

// The guards of the two subpoena routes converted to the guard-owned
// transaction, executed rather than merely declared.
//
// subpoenaControllerGuards.spec.ts and updateSubpoeanaGuards.spec.ts pin the
// declared order and subpoenaRolesRules.spec.ts pins that no rule on the
// converted user route reads the case. Neither runs a guard, and a wrong order
// here is not visible anywhere else: guards do not execute in controller unit
// tests, so a chain that locks the case row for every authenticated caller -
// or one that never reads the case the guards after it depend on - passes the
// whole suite. This table runs them, in Nest's order, for every user role on
// createSubpoenas, and for the police service update behind the token guard.
//
// Authentication is out of the picture on the user route: every row supplies
// a user, and what is tested is what the route's authorization guards do with
// them. Passport's real jwt strategy is not registered in a unit test, so it
// stands in as a subclass - the chain still refuses to run if the controller
// gains a class-level guard this spec does not account for. The internal
// route runs the real TokenGuard: it decides from a header alone, so it is
// cheap to run and the row that sends the wrong token proves the lock is not
// taken on an unauthenticated caller's behalf.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const courtId = uuid()
const defendantId = uuid()
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
const courtUser = (role: UserRole, institutionId = courtId) =>
  userAt(role, institutionId, InstitutionType.DISTRICT_COURT)

const receivedIndictmentAtCourt = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
    courtId,
    defendants: [{ id: defendantId, caseId } as Defendant],
  } as Case)

// The subpoena the police named, as the locked case carries it.
const withNamedSubpoena = (theCase: Case, subpoenaId: string) =>
  ({
    ...theCase,
    defendants: [
      {
        id: defendantId,
        caseId: theCase.id,
        subpoenas: [
          {
            id: subpoenaId,
            caseId: theCase.id,
            defendantId,
            created: new Date(),
          } as Subpoena,
        ],
      } as Defendant,
    ],
  } as Case)

// The same subpoena after its defendant left with a split case: it stays with
// the case it was issued in, and the locked case carries it under the split
// case's defendant.
const withNamedSubpoenaOnSplitCase = (theCase: Case, subpoenaId: string) =>
  ({
    ...theCase,
    defendants: [] as Defendant[],
    splitCases: [
      {
        id: uuid(),
        defendants: [
          {
            id: defendantId,
            caseId: uuid(),
            subpoenas: [
              {
                id: subpoenaId,
                caseId: theCase.id,
                defendantId,
                created: new Date(),
              } as Subpoena,
            ],
          } as Defendant,
        ],
      } as Case,
    ],
  } as Case)

// One row per allowed role: the user and a case they can read.
type AllowedRow = [UserRole, User, (caseId: string) => Case]

const courtRows: AllowedRow[] = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
].map((role) => [role, courtUser(role), receivedIndictmentAtCourt])

describe('SubpoenaController - createSubpoenas guard chain', () => {
  const allowedRoles = courtRows.map(([role]) => role)
  const rejectedRoles = Object.values(UserRole).filter(
    (role) => !allowedRoles.includes(role),
  )

  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    caseId: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    jest.clearAllMocks()

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
      new CaseReadGuard(),
    ]

    runChain = (user, caseId) =>
      runInRequestContext(() =>
        runGuardChain(SubpoenaController, 'createSubpoenas', guards, {
          params: { caseId },
          user: { currentUser: user },
          case: undefined,
        }),
      )
  })

  describe.each(courtRows)(
    '%s on a case they can read',
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
        receivedIndictmentAtCourt(caseId),
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

  // The guards after the locking read all decide from request.case. Each of
  // them throws a 500 for a missing case and a 403 for the case it was given,
  // so the error type is what shows the read came first.
  describe('case is not an indictment case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce({
        ...receivedIndictmentAtCourt(caseId),
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
        receivedIndictmentAtCourt(caseId),
      )

      then = await runChain(
        courtUser(UserRole.DISTRICT_COURT_JUDGE, uuid()),
        caseId,
      )
    })

    it('should be rejected by CaseReadGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseReadGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })
})

describe('InternalSubpoenaController - updateSubpoena guard chain', () => {
  const policeSubpoenaId = uuid()
  const subpoenaId = uuid()
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let mockSubpoenaService: SubpoenaService
  let request: {
    params: { policeSubpoenaId: string; caseId?: string }
    subpoena?: Subpoena
    defendant?: Defendant
    case?: Case
  }
  let runChain: (
    authorization: string | undefined,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    jest.clearAllMocks()

    const { caseRepositoryService, caseService, subpoenaService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSubpoenaService = subpoenaService

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new TokenGuard({ jwtSecret: '', secretToken, isConfigured: true }),
      new PoliceSubpoenaExistsGuard(subpoenaService),
      new CaseExistsForUpdateGuard(caseService, sequelize),
      new SubpoenaOnCaseGuard(),
    ]

    // The police name the subpoena rather than the case, so the request
    // carries no case id: PoliceSubpoenaExistsGuard supplies it.
    runChain = (authorization) => {
      request = {
        params: { policeSubpoenaId },
        headers: { authorization },
        case: undefined,
      } as typeof request

      return runInRequestContext(() =>
        runGuardChain(
          InternalSubpoenaController,
          'updateSubpoena',
          guards,
          request,
        ),
      )
    }
  })

  const lookedUpSubpoena = (caseId: string) =>
    ({
      id: subpoenaId,
      caseId,
      defendantId,
      policeSubpoenaId,
      case: { id: caseId } as Case,
      defendant: { id: defendantId } as Defendant,
    } as Subpoena)

  describe('police subpoena known', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockResolvedValueOnce(lookedUpSubpoena(caseId))

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        withNamedSubpoena(receivedIndictmentAtCourt(caseId), subpoenaId),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })

    // The case id the locking read uses is the one the subpoena lookup put
    // on the request, so the lock lands on the subpoena's own case.
    it("should read the subpoena's case under the request transaction", () => {
      expect(mockSubpoenaService.findByPoliceSubpoenaId).toHaveBeenCalledWith(
        policeSubpoenaId,
      )
      expect(request.params.caseId).toBe(caseId)
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })

    // The handler decides the status change from request.subpoena, so what
    // it sees must be the copy read under the lock, not the one looked up
    // before it - and the defendant it writes to is the locked case's.
    it('should hand the handler the subpoena and defendant as the locked case carries them', () => {
      const defendantOnCase = request.case?.defendants?.find(
        (defendant) => defendant.id === defendantId,
      )
      const subpoenaOnCase = defendantOnCase?.subpoenas?.find(
        (candidate) => candidate.id === subpoenaId,
      )

      expect(subpoenaOnCase).toBeDefined()
      expect(request.subpoena).toBe(subpoenaOnCase)
      expect(request.defendant).toBe(defendantOnCase)
    })
  })

  describe('police subpoena known, issued before its defendant left with a split case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockResolvedValueOnce(lookedUpSubpoena(caseId))

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        withNamedSubpoenaOnSplitCase(
          receivedIndictmentAtCourt(caseId),
          subpoenaId,
        ),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })

    it("should lock the case the subpoena was issued in and hand the handler the split case's copies", () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)

      const defendantOnSplitCase = request.case?.splitCases?.[0].defendants?.[0]

      expect(defendantOnSplitCase).toBeDefined()
      expect(request.defendant).toBe(defendantOnSplitCase)
      expect(request.subpoena).toBe(defendantOnSplitCase?.subpoenas?.[0])
    })
  })

  describe('subpoena is not on the locked case', () => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockResolvedValueOnce(lookedUpSubpoena(caseId))

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        withNamedSubpoena(receivedIndictmentAtCourt(caseId), uuid()),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should be rejected by SubpoenaOnCaseGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(SubpoenaOnCaseGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })

    it('should have read the case under the request transaction first', () => {
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
    })
  })

  describe('wrong token', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockResolvedValueOnce(lookedUpSubpoena(uuid()))

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        receivedIndictmentAtCourt(uuid()),
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
    it('should neither look the subpoena up nor read the case', () => {
      expect(mockSubpoenaService.findByPoliceSubpoenaId).not.toHaveBeenCalled()
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).not.toHaveBeenCalled()
    })
  })

  describe('police subpoena unknown', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockRejectedValueOnce(new NotFoundException())

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(
        receivedIndictmentAtCourt(uuid()),
      )

      then = await runChain(`Bearer ${secretToken}`)
    })

    it('should be rejected by PoliceSubpoenaExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(PoliceSubpoenaExistsGuard.name)
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
      const mockFindByPoliceSubpoenaId =
        mockSubpoenaService.findByPoliceSubpoenaId as jest.Mock
      mockFindByPoliceSubpoenaId.mockResolvedValueOnce(lookedUpSubpoena(uuid()))

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
