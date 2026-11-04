import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
} from '../../repository'
import { DeleteResponse } from '../models/delete.response'

interface Then {
  result: DeleteResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
) => Promise<Then>

describe('IndictmentCountController - Delete', () => {
  let mockIndictmentCountRepositoryService: IndictmentCountRepositoryService
  let mockOffenseRepositoryService: OffenseRepositoryService

  let transaction: Transaction
  let mockTransaction: jest.Mock
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      indictmentCountRepositoryService,
      offenseRepositoryService,
      indictmentCountController,
      sequelize,
    } = await createTestingIndictmentCountModule()

    mockIndictmentCountRepositoryService = indictmentCountRepositoryService
    mockOffenseRepositoryService = offenseRepositoryService

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (caseId: string, indictmentCountId: string) => {
      const then = {} as Then

      try {
        // The routes are guarded by MinimalCaseExistsForUpdateGuard, so the
        // request transaction is already open by the time the handler runs.
        // Guards do not execute in controller unit tests, so the request
        // context is set up here instead.
        await runInRequestContext(async () => {
          // Stand in for the guard, which opens the request transaction
          // before the handler runs.
          await getOrCreateTransaction(sequelize)

          then.result = await indictmentCountController.delete(
            caseId,
            indictmentCountId,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count deleted', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndCase =
        mockIndictmentCountRepositoryService.deleteByIdAndCase as jest.Mock
      mockDeleteByIdAndCase.mockResolvedValueOnce(1)

      const mockFindAllForCaseOrdered =
        mockIndictmentCountRepositoryService.findAllForCaseOrdered as jest.Mock
      mockFindAllForCaseOrdered.mockResolvedValueOnce([])

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should delete the indictment count and related offenses', () => {
      expect(
        mockOffenseRepositoryService.deleteAllForIndictmentCount,
      ).toHaveBeenCalledWith(indictmentCountId, { transaction })
      expect(
        mockIndictmentCountRepositoryService.deleteByIdAndCase,
      ).toHaveBeenCalledWith(indictmentCountId, caseId, { transaction })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('remaining indictment counts renormalized', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const remainingIndictmentCounts = [
      { id: uuid(), displayOrder: 2 },
      { id: uuid(), displayOrder: 5 },
    ]
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndCase =
        mockIndictmentCountRepositoryService.deleteByIdAndCase as jest.Mock
      mockDeleteByIdAndCase.mockResolvedValueOnce(1)

      const mockFindAllForCaseOrdered =
        mockIndictmentCountRepositoryService.findAllForCaseOrdered as jest.Mock
      mockFindAllForCaseOrdered.mockResolvedValueOnce(remainingIndictmentCounts)

      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValue({
        numberOfAffectedRows: 1,
        indictmentCounts: [{}],
      })

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should close the gap in the display order', () => {
      expect(
        mockIndictmentCountRepositoryService.findAllForCaseOrdered,
      ).toHaveBeenCalledWith(caseId, { transaction })
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        remainingIndictmentCounts[0].id,
        caseId,
        { displayOrder: 0 },
        { transaction },
      )
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        remainingIndictmentCounts[1].id,
        caseId,
        { displayOrder: 1 },
        { transaction },
      )
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('indictment count deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndCase =
        mockIndictmentCountRepositoryService.deleteByIdAndCase as jest.Mock
      mockDeleteByIdAndCase.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
