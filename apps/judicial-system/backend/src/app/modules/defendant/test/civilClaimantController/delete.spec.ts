import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  CaseFileRepositoryService,
  CivilClaimantRepositoryService,
} from '../../../repository'
import { DeleteCivilClaimantResponse } from '../../models/deleteCivilClaimant.response'

interface Then {
  result: DeleteCivilClaimantResponse
  error: Error
}

type GivenWhenThen = (
  caseId?: string,
  civilClaimaintId?: string,
) => Promise<Then>

describe('CivilClaimantController - Delete', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const transaction = {} as Transaction

  let mockCivilClaimantRepositoryService: CivilClaimantRepositoryService
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      civilClaimantController,
      civilClaimantRepositoryService,
      caseFileRepositoryService,
    } = await createTestingDefendantModule()

    mockCivilClaimantRepositoryService = civilClaimantRepositoryService
    mockCaseFileRepositoryService = caseFileRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockDelete =
      mockCivilClaimantRepositoryService.deleteByIdAndCase as jest.Mock
    mockDelete.mockRejectedValue(new Error('Test error'))

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await civilClaimantController.delete(
          caseId,
          civilClaimantId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('civil claimant deleted', () => {
    let then: Then

    beforeEach(async () => {
      const mockDelete =
        mockCivilClaimantRepositoryService.deleteByIdAndCase as jest.Mock
      mockDelete.mockResolvedValue(1)

      then = await givenWhenThen(caseId, civilClaimantId)
    })

    it("should delete the civil claimant's case files", () => {
      expect(
        mockCaseFileRepositoryService.deleteAllForCivilClaimant,
      ).toHaveBeenCalledWith(caseId, civilClaimantId, { transaction })
    })

    it('should delete civil claimant', () => {
      expect(
        mockCivilClaimantRepositoryService.deleteByIdAndCase,
      ).toHaveBeenCalledWith(civilClaimantId, caseId, { transaction })
      expect(then.result).toEqual({ deleted: true })
    })

    it('should delete the case files before the civil claimant', () => {
      const mockDeleteFiles =
        mockCaseFileRepositoryService.deleteAllForCivilClaimant as jest.Mock
      const mockDelete =
        mockCivilClaimantRepositoryService.deleteByIdAndCase as jest.Mock

      expect(mockDeleteFiles.mock.invocationCallOrder[0]).toBeLessThan(
        mockDelete.mock.invocationCallOrder[0],
      )
    })
  })

  describe('case file deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockDeleteFiles =
        mockCaseFileRepositoryService.deleteAllForCivilClaimant as jest.Mock
      mockDeleteFiles.mockRejectedValue(new Error('Case file error'))

      then = await givenWhenThen(caseId, civilClaimantId)
    })

    it('should not delete the civil claimant', () => {
      expect(
        mockCivilClaimantRepositoryService.deleteByIdAndCase,
      ).not.toHaveBeenCalled()
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Case file error')
    })
  })

  describe('civil claimant deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Test error')
    })
  })
})
