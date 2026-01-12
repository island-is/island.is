import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { IndictmentCount, Offense } from '../../repository'
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
  let mockIndictmentCountModel: typeof IndictmentCount
  let mockOffenseModel: typeof Offense

  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      indictmentCountModel,
      offenseModel,
      indictmentCountController,
      sequelize,
    } = await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel
    mockOffenseModel = offenseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string, indictmentCountId: string) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.delete(
          caseId,
          indictmentCountId,
        )
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
      const mockDestroy = mockIndictmentCountModel.destroy as jest.Mock
      mockDestroy.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should delete the indictment count and related offenses', () => {
      expect(mockOffenseModel.destroy).toHaveBeenCalledWith({
        transaction,
        where: { indictmentCountId },
      })
      expect(mockIndictmentCountModel.destroy).toHaveBeenCalledWith({
        transaction,
        where: { id: indictmentCountId, caseId },
      })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('indictment count deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockIndictmentCountModel.destroy as jest.Mock
      mockDestroy.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
