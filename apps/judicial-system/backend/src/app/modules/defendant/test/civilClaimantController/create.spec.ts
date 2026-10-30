import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { runInRequestContext } from '../../../../test'
import {
  Case,
  CivilClaimant,
  CivilClaimantRepositoryService,
} from '../../../repository'

interface Then {
  result: CivilClaimant
  error: Error
}

type GivenWhenThen = (caseId?: string) => Promise<Then>

describe('CivilClaimantController - Create', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const theCase = { id: caseId } as Case
  const createdCivilClaimant = { id: civilClaimantId, caseId }

  let mockCivilClaimantRepositoryService: CivilClaimantRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      civilClaimantRepositoryService,
      civilClaimantController,
    } = await createTestingDefendantModule()

    mockCivilClaimantRepositoryService = civilClaimantRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockCreate = mockCivilClaimantRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdCivilClaimant)

    givenWhenThen = async () => {
      const then = {} as Then

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      try {
        await runInRequestContext(async () => {
          then.result = await civilClaimantController.create(
            theCase.id,
            theCase,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('civil claimant creation', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId)
    })

    it('should create a civil claimant', () => {
      expect(mockCivilClaimantRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { transaction },
      )
    })

    it('should return the created civil claimant', () => {
      expect(then.result).toEqual(createdCivilClaimant)
    })
  })

  describe('civil claimant creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCivilClaimantRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValue(new Error('Test error'))

      then = await givenWhenThen(caseId)
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Test error')
    })
  })
})
