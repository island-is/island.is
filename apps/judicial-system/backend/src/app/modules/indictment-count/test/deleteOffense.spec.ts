import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import { OffenseRepositoryService } from '../../repository'
import { DeleteResponse } from '../models/delete.response'

interface Then {
  result: DeleteResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  offenseId: string,
) => Promise<Then>

describe('IndictmentCountController - Delete offense', () => {
  let mockOffenseRepositoryService: OffenseRepositoryService
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction
  let mockTransaction: jest.Mock

  beforeEach(async () => {
    const { offenseRepositoryService, indictmentCountController, sequelize } =
      await createTestingIndictmentCountModule()

    mockOffenseRepositoryService = offenseRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      offenseId: string,
    ) => {
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

          then.result = await indictmentCountController.deleteOffense(
            caseId,
            indictmentCountId,
            offenseId,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('offense deleted', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndIndictmentCount =
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount as jest.Mock
      mockDeleteByIdAndIndictmentCount.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should delete the offense under the request transaction', () => {
      expect(
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount,
      ).toHaveBeenCalledWith(offenseId, indictmentCountId, { transaction })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('offense deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndIndictmentCount =
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount as jest.Mock
      mockDeleteByIdAndIndictmentCount.mockRejectedValueOnce(
        new Error('Some error'),
      )

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
