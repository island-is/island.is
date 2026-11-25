import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ServiceRequirement } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../../../repository'
import { UpdateVerdictDto } from '../../dto/updateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (verdictUpdate: UpdateVerdictDto) => Promise<Then>

describe('VerdictController - Update', () => {
  const caseId = uuid()
  const theCase = { id: caseId, rulingDate: new Date(2020, 1, 1) } as Case

  const defendantId = uuid()
  const defendant = {
    id: defendantId,
    name: 'Jane Doe',
  } as Defendant

  const verdictId = uuid()
  const verdict = {
    id: verdictId,
    caseId,
    defendantId,
  } as Verdict

  let mockVerdictRepositoryService: VerdictRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { verdictController, sequelize, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (verdictUpdate) => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          then.result = await verdictController.update(
            theCase.id,
            defendant.id,
            theCase,
            verdict,
            verdictUpdate,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('verdict updated', () => {
    const verdictUpdate = {
      serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
    }
    const updateVerdict = { ...verdict, ...verdictUpdate }
    let then: Then

    beforeEach(async () => {
      const mockFind = mockVerdictRepositoryService.findById as jest.Mock
      mockFind.mockResolvedValueOnce(verdict)

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updateVerdict)

      then = await givenWhenThen(verdictUpdate)
    })

    it('should update the verdict in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        // since service requirement is not applicable, the serviceDate will be set to same as the ruling date
        { ...verdictUpdate, serviceDate: new Date(2020, 1, 1) },
        { transaction },
      )
      expect(then.result).toBe(updateVerdict)
    })
  })

  describe('verdict update fails', () => {
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
