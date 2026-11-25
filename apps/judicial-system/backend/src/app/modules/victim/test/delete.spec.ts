import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import { Case, Victim, VictimRepositoryService } from '../../repository'
import { DeleteVictimResponse } from '../models/deleteVictim.response'

interface Then {
  result: DeleteVictimResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('VictimController - Delete', () => {
  const caseId = uuid()
  const victimId = uuid()

  let mockVictimRepositoryService: VictimRepositoryService
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimRepositoryService, sequelize } =
      await createTestingVictimModule()

    mockVictimRepositoryService = victimRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockDelete =
      mockVictimRepositoryService.deleteByIdAndCase as jest.Mock
    mockDelete.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
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

          then.result = await victimController.delete(
            caseId,
            victimId,
            { id: caseId } as Case,
            { id: victimId } as Victim,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('victim deleted', () => {
    let then: Then

    beforeEach(async () => {
      const mockDelete =
        mockVictimRepositoryService.deleteByIdAndCase as jest.Mock
      mockDelete.mockResolvedValue(1)

      then = await givenWhenThen()
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should delete the victim under the request transaction', () => {
      expect(
        mockVictimRepositoryService.deleteByIdAndCase,
      ).toHaveBeenCalledWith(victimId, caseId, { transaction })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('victim deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
