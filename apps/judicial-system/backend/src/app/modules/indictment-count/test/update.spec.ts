import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { IndictmentCount } from '../../repository'
import { UpdateIndictmentCountDto } from '../dto/updateIndictmentCount.dto'

interface Then {
  result: IndictmentCount | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  indictmentCountToUpdate: UpdateIndictmentCountDto,
) => Promise<Then>

describe('IndictmentCountController - Update', () => {
  const caseId = uuid()
  const indictmentCountId = uuid()
  const policeCaseNumber = uuid()
  const indictmentCountToUpdate = { policeCaseNumber }

  let mockIndictmentCountModel: typeof IndictmentCount
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { indictmentCountModel, indictmentCountController, sequelize } =
      await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      indictmentCountToUpdate: UpdateIndictmentCountDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.update(
          caseId,
          indictmentCountId,
          indictmentCountToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count updated', () => {
    const updatedIndictmentCount = {
      id: indictmentCountId,
      caseId,
      policeCaseNumber,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedIndictmentCount]])

      const mockFindOne = mockIndictmentCountModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedIndictmentCount)

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should update the indictment count', () => {
      expect(mockIndictmentCountModel.update).toHaveBeenCalledWith(
        indictmentCountToUpdate,
        {
          where: { id: indictmentCountId, caseId },
          returning: true,
          transaction,
        },
      )
      expect(then.result).toBe(updatedIndictmentCount)
    })
  })

  describe('indictment count update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
