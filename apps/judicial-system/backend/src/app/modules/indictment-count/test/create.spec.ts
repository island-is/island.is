import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  IndictmentCount,
  IndictmentCountRepositoryService,
} from '../../repository'

interface Then {
  result: IndictmentCount
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('IndictmentCountController - Create', () => {
  let mockIndictmentCountRepositoryService: IndictmentCountRepositoryService
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction
  let mockTransaction: jest.Mock

  beforeEach(async () => {
    const {
      indictmentCountRepositoryService,
      indictmentCountController,
      sequelize,
    } = await createTestingIndictmentCountModule()

    mockIndictmentCountRepositoryService = indictmentCountRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (caseId: string) => {
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

          then.result = await indictmentCountController.create(caseId)
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('first indictment count created', () => {
    const caseId = uuid()
    const createdIndictmentCount = { id: uuid() }
    let then: Then

    beforeEach(async () => {
      const mockGetMaxDisplayOrderForCase =
        mockIndictmentCountRepositoryService.getMaxDisplayOrderForCase as jest.Mock
      mockGetMaxDisplayOrderForCase.mockResolvedValueOnce(null)

      const mockCreate =
        mockIndictmentCountRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdIndictmentCount)

      then = await givenWhenThen(caseId)
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should create an indictment count at display order 0', () => {
      expect(
        mockIndictmentCountRepositoryService.getMaxDisplayOrderForCase,
      ).toHaveBeenCalledWith(caseId, { transaction })
      expect(mockIndictmentCountRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { displayOrder: 0 },
        { transaction },
      )
      expect(then.result).toBe(createdIndictmentCount)
    })
  })

  describe('further indictment count created', () => {
    const caseId = uuid()
    const createdIndictmentCount = { id: uuid() }
    let then: Then

    beforeEach(async () => {
      const mockGetMaxDisplayOrderForCase =
        mockIndictmentCountRepositoryService.getMaxDisplayOrderForCase as jest.Mock
      mockGetMaxDisplayOrderForCase.mockResolvedValueOnce(2)

      const mockCreate =
        mockIndictmentCountRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdIndictmentCount)

      then = await givenWhenThen(caseId)
    })

    it('should create an indictment count after the last one', () => {
      expect(mockIndictmentCountRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { displayOrder: 3 },
        { transaction },
      )
      expect(then.result).toBe(createdIndictmentCount)
    })
  })

  describe('indictment count creation fails', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockCreate =
        mockIndictmentCountRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
