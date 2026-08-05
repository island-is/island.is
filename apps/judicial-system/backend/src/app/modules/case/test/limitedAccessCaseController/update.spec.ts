import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

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
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseRepositoryService, limitedAccessCaseController } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(updatedCase)
    const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
    mockFindOne.mockResolvedValue(updatedCase)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.update(
          caseId,
          user,
          theCase,
          updateDto,
        )
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

    it('should update the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        updateDto,
        { transaction },
      )
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })
})
