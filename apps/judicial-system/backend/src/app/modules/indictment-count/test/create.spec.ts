import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { IndictmentCount } from '../../repository'

interface Then {
  result: IndictmentCount
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('IndictmentCountController - Create', () => {
  let mockIndictmentCountModel: typeof IndictmentCount
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction

  beforeEach(async () => {
    const { indictmentCountModel, indictmentCountController, sequelize } =
      await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel
    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.create(caseId)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count created', () => {
    const caseId = uuid()
    const createdIndictmentCount = { id: uuid() }
    let then: Then

    beforeEach(async () => {
      const mockMax = mockIndictmentCountModel.max as jest.Mock
      mockMax.mockResolvedValueOnce(-1)

      const mockCreate = mockIndictmentCountModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdIndictmentCount)

      then = await givenWhenThen(caseId)
    })

    it('should create an indictment count', () => {
      expect(mockIndictmentCountModel.max).toHaveBeenCalledWith(
        'displayOrder',
        {
          where: { caseId },
          transaction,
        },
      )
      expect(mockIndictmentCountModel.create).toHaveBeenCalledWith(
        {
          caseId,
          displayOrder: 0,
        },
        { transaction },
      )
      expect(then.result).toBe(createdIndictmentCount)
    })
  })

  describe('indictment count creation fails', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockIndictmentCountModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
