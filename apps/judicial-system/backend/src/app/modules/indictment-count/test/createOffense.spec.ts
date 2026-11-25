import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import { Offense, OffenseRepositoryService } from '../../repository'

interface Then {
  result: Offense
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  offense: IndictmentCountOffense,
) => Promise<Then>

describe('IndictmentCountController - Create offense', () => {
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
      offense: IndictmentCountOffense,
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

          then.result = await indictmentCountController.createOffense(
            caseId,
            indictmentCountId,
            { offense },
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('offense created', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offense = IndictmentCountOffense.DRIVING_WITHOUT_LICENCE
    const createdOffense = { id: uuid(), indictmentCountId, offense }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockOffenseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdOffense)

      then = await givenWhenThen(caseId, indictmentCountId, offense)
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should create the offense under the request transaction', () => {
      expect(mockOffenseRepositoryService.create).toHaveBeenCalledWith(
        indictmentCountId,
        offense,
        { transaction },
      )
      expect(then.result).toBe(createdOffense)
    })
  })

  describe('offense creation fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offense = IndictmentCountOffense.DRIVING_WITHOUT_LICENCE

    let then: Then

    beforeEach(async () => {
      const mockCreate = mockOffenseRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId, offense)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
