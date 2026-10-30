import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('LimitedAccessCaseController - Update', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const caseId = uuid()
  const theCase = {
    id: caseId,
  } as Case
  const updateDto = { validToDate: new Date() }
  const updatedCase = {
    ...theCase,
    validToDate: updateDto.validToDate,
  } as Case

  let mockCaseRepositoryService: CaseRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseRepositoryService, limitedAccessCaseController } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(updatedCase)
    const mockFindLimitedAccessById =
      mockCaseRepositoryService.findLimitedAccessById as jest.Mock
    mockFindLimitedAccessById.mockResolvedValue(updatedCase)

    // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
    // request transaction is already open - and holding a lock on this case
    // row - by the time the handler runs. Guards do not execute in
    // controller unit tests, so the request context and that transaction are
    // set up here instead.
    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          return limitedAccessCaseController.update(
            caseId,
            user,
            theCase,
            updateDto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case updated', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should update the case in the transaction the guard opened', () => {
      // Once, by the stand-in for the guard above. A second call would be
      // the handler opening a transaction of its own, which would block on
      // the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        updateDto,
        { transaction },
      )
    })

    it('should re-read the case in the same transaction and return it', () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessById,
      ).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: undefined,
        transaction,
      })
      expect(then.result).toEqual(updatedCase)
    })
  })
})
