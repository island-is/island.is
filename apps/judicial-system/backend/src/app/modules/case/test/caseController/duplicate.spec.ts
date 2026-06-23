import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case, CaseRepositoryService } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: TUser,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Duplicate', () => {
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseRepositoryService, caseController } =
      await createTestingCaseModule()
    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.duplicate(caseId, user, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    CaseIndictmentRulingDecision.WITHDRAWAL,
    CaseIndictmentRulingDecision.CANCELLATION,
  ])('revoked indictment duplicated (%s)', (indictmentRulingDecision) => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const user = {
      id: userId,
      institution: { id: prosecutorsOfficeId },
    } as TUser
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision,
    } as Case
    const duplicatedCaseId = uuid()
    const duplicatedCase = { id: duplicatedCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockDuplicate =
        mockCaseRepositoryService.duplicateIndictmentToDraft as jest.Mock
      mockDuplicate.mockResolvedValueOnce(duplicatedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should duplicate the case into a new draft', () => {
      expect(
        mockCaseRepositoryService.duplicateIndictmentToDraft,
      ).toHaveBeenCalledWith(caseId, {
        transaction,
        prosecutorId: userId,
        prosecutorsOfficeId,
      })
      expect(then.result).toBe(duplicatedCase)
    })
  })

  describe('non-revoked indictment', () => {
    const user = { id: uuid(), institution: { id: uuid() } } as TUser
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw ForbiddenException and not duplicate', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(
        mockCaseRepositoryService.duplicateIndictmentToDraft,
      ).not.toHaveBeenCalled()
    })
  })
})
