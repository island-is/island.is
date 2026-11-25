import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import { Case, Victim, VictimRepositoryService } from '../../repository'
import { UpdateVictimDto } from '../dto/updateVictim.dto'

interface Then {
  result: Victim
  error: Error
}

type GivenWhenThen = (victimUpdate: UpdateVictimDto) => Promise<Then>

describe('VictimController - Update', () => {
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const victimId = uuid()
  const victim = {
    id: victimId,
    name: 'Jane Doe',
  } as Victim

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

    const mockUpdate =
      mockVictimRepositoryService.updateByIdAndCase as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (victimUpdate) => {
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

          then.result = await victimController.update(
            theCase.id,
            victim.id,
            victim,
            theCase,
            victimUpdate,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('victim updated', () => {
    const victimUpdate = { hasNationalId: true, nationalId: uuid() }
    const updatedVictim = { ...victim, ...victimUpdate }
    let then: Then

    beforeEach(async () => {
      const mockUpdate =
        mockVictimRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        victims: [updatedVictim],
      })
      then = await givenWhenThen(victimUpdate)
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should update the victim under the request transaction', () => {
      expect(
        mockVictimRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(victimId, caseId, victimUpdate, { transaction })
      expect(then.result).toBe(updatedVictim)
    })
  })

  describe('victim update fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({})
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
