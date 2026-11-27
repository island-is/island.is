import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'
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

import { runGuardChain } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'

// The candidate merge cases route's guards, executed rather than merely
// declared: guards do not run in controller unit tests, and
// caseControllerGuards.spec.ts only pins the declaration. The candidates are
// read for a case, so the route is for the users who can read that case.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

describe('CaseController - Get candidate merge cases guard chain', () => {
  const courtId = uuid()

  const courtUser = (role: UserRole, institutionId = courtId) =>
    ({
      id: uuid(),
      role,
      institution: { id: institutionId, type: InstitutionType.DISTRICT_COURT },
    } as User)

  const receivedCaseAtCourt = (caseId: string, type = CaseType.INDICTMENT) =>
    ({ id: caseId, type, state: CaseState.RECEIVED, courtId } as Case)

  const courtRoles = [
    UserRole.DISTRICT_COURT_JUDGE,
    UserRole.DISTRICT_COURT_REGISTRAR,
    UserRole.DISTRICT_COURT_ASSISTANT,
  ]

  let mockCaseRepositoryService: CaseRepositoryService
  let runChain: (
    user: User,
    theCase: Case,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  beforeEach(async () => {
    const { caseRepositoryService, caseService } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new CaseExistsGuard(caseService),
      new CaseReadGuard(),
    ]

    runChain = (user, theCase) => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)

      return runGuardChain(CaseController, 'getCandidateMergeCases', guards, {
        params: { caseId: theCase.id },
        user: { currentUser: user },
        case: undefined,
      })
    }
  })

  describe.each(courtRoles)('%s at the court of the case', (role) => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      then = await runChain(courtUser(role), receivedCaseAtCourt(uuid()))
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })
  })

  describe.each(courtRoles)('%s at another court', (role) => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      then = await runChain(
        courtUser(role, uuid()),
        receivedCaseAtCourt(uuid()),
      )
    })

    it('should be rejected by CaseReadGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseReadGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('request case', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      then = await runChain(
        courtUser(UserRole.DISTRICT_COURT_JUDGE),
        receivedCaseAtCourt(uuid(), CaseType.CUSTODY),
      )
    })

    it('should be rejected by CaseTypeGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseTypeGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('prosecutor', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      then = await runChain(
        {
          id: uuid(),
          role: UserRole.PROSECUTOR,
          institution: {
            id: uuid(),
            type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
          },
        } as User,
        receivedCaseAtCourt(uuid()),
      )
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })
  })
})
