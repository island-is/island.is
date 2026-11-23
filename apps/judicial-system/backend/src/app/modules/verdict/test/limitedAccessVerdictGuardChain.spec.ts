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
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../test'
import { CaseCompletedGuard } from '../../case/guards/caseCompleted.guard'
import { CaseTypeGuard } from '../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../../case/guards/limitedAccessCaseExistsForUpdate.guard'
import { DefendantExistsGuard } from '../../defendant/guards/defendantExists.guard'
import {
  Case,
  CaseRepositoryService,
  Defendant,
  Verdict,
} from '../../repository'
import { VerdictExistsGuard } from '../guards/verdictExists.guard'
import { LimitedAccessVerdictController } from '../limitedAccessVerdict.controller'

// The guards of the route a defender accepts a verdict through, executed
// rather than merely declared: guards do not run in controller unit tests, so
// a chain in the wrong order - or one that never admits a defender - would
// pass the rest of the suite.
//
// Passport's real jwt strategy is not registered in a unit test, so it stands
// in as a subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const defenderNationalId = '0101010000'
const defendantId = uuid()

const defender = () =>
  ({
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User)

const completedIndictmentCase = (caseId: string) =>
  ({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    defendants: [
      {
        id: defendantId,
        caseId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        verdicts: [
          { id: uuid(), caseId, defendantId, created: new Date() } as Verdict,
        ],
      } as Defendant,
    ],
  } as Case)

describe('LimitedAccessVerdictController - class-level guards', () => {
  it('should require an authenticated user', () => {
    expect(
      Reflect.getMetadata('__guards__', LimitedAccessVerdictController),
    ).toContain(JwtAuthUserGuard)
  })
})

describe('LimitedAccessVerdictController - acceptVerdict guard chain', () => {
  const transaction = {} as Transaction

  let mockCaseRepositoryService: CaseRepositoryService
  let mockSequelize: Sequelize
  let runChain: (
    user: User,
    caseId: string,
    requestedDefendantId?: string,
  ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

  const primeCase = (theCase: Case | null) => {
    const mockFindLimitedAccessByIdForUpdate =
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
    mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(theCase)
  }

  beforeEach(async () => {
    const { caseRepositoryService, limitedAccessCaseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSequelize = sequelize

    const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    const guards = [
      new AuthenticatedGuard(),
      new RolesGuard(new Reflector()),
      new LimitedAccessCaseExistsForUpdateGuard(
        limitedAccessCaseService,
        sequelize,
      ),
      new CaseWriteGuard(),
      new DefendantExistsGuard(),
      new VerdictExistsGuard(),
      new CaseCompletedGuard(),
    ]

    runChain = (user, caseId, requestedDefendantId = defendantId) =>
      runInRequestContext(() =>
        runGuardChain(LimitedAccessVerdictController, 'acceptVerdict', guards, {
          params: { caseId, defendantId: requestedDefendantId },
          user: { currentUser: user },
          case: undefined,
        }),
      )
  })

  describe('the confirmed defender of a completed indictment case', () => {
    const caseId = uuid()
    const user = defender()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      primeCase(completedIndictmentCase(caseId))

      then = await runChain(user, caseId)
    })

    it('should let the whole chain through', () => {
      expect(then.error).toBeUndefined()
      expect(then.rejectedBy).toBeUndefined()
      expect(then.allowed).toBe(true)
    })

    it('should read the case under the request transaction', () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: user.nationalId,
        transaction,
      })
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    })
  })

  describe.each(
    Object.values(UserRole).filter((role) => role !== UserRole.DEFENDER),
  )('%s', (role) => {
    const caseId = uuid()
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      primeCase(completedIndictmentCase(caseId))

      then = await runChain(
        {
          id: uuid(),
          role,
          nationalId: defenderNationalId,
          institution: { id: uuid(), type: InstitutionType.DISTRICT_COURT },
        } as User,
        caseId,
      )
    })

    it('should be rejected by RolesGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(RolesGuard.name)
    })

    // The stub is primed with a case above, so this fails if the read happens
    // rather than passing because the read would have failed anyway.
    it('should not read or lock the case', () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).not.toHaveBeenCalled()
      expect(mockSequelize.transaction).not.toHaveBeenCalled()
    })
  })

  describe('case does not exist', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      primeCase(null)

      then = await runChain(defender(), uuid())
    })

    it('should be rejected by the case-exists guard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(LimitedAccessCaseExistsForUpdateGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('case is not an indictment case', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const caseId = uuid()
      primeCase({
        ...completedIndictmentCase(caseId),
        type: CaseType.CUSTODY,
      } as Case)

      then = await runChain(defender(), caseId)
    })

    it('should be rejected by CaseTypeGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseTypeGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('a defender who is not on the case', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const caseId = uuid()
      primeCase(completedIndictmentCase(caseId))

      then = await runChain(
        { ...defender(), nationalId: '0202020000' } as User,
        caseId,
      )
    })

    it('should be rejected by CaseWriteGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(CaseWriteGuard.name)
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('defendant is not on the case', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const caseId = uuid()
      primeCase(completedIndictmentCase(caseId))

      then = await runChain(defender(), caseId, uuid())
    })

    it('should be rejected by DefendantExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(DefendantExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('defendant has no verdict', () => {
    let then: Awaited<ReturnType<typeof runChain>>

    beforeEach(async () => {
      const caseId = uuid()
      const theCase = completedIndictmentCase(caseId)
      primeCase({
        ...theCase,
        defendants: theCase.defendants?.map(
          (defendant) =>
            ({ ...defendant, verdicts: [] } as unknown as Defendant),
        ),
      } as Case)

      then = await runChain(defender(), caseId)
    })

    it('should be rejected by VerdictExistsGuard', () => {
      expect(then.allowed).toBe(false)
      expect(then.rejectedBy).toBe(VerdictExistsGuard.name)
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
