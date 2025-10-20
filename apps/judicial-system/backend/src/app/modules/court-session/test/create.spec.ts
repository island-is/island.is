import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { createTestingCourtSessionModule } from './createTestingCourtSessionModule'

import {
  Case,
  CourtSession,
  CourtSessionRepositoryService,
} from '../../repository'

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('CourtSessionController - Create', () => {
  const caseId = uuid()
  const courtSessionId = uuid()

  let transaction: Transaction
  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, courtSessionRepositoryService, courtSessionController } =
      await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    const mockCreate = mockCourtSessionRepositoryService.create as jest.Mock
    mockCreate.mockRejectedValue(new Error('Faild to create court session'))

    givenWhenThen = async (caseId: string) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.create(caseId, {
          id: caseId,
          courtSessions: [{ id: uuid() }],
        } as Case)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court session created', () => {
    const createdCourtSession = {
      id: courtSessionId,
      caseId,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCourtSessionRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCourtSession)

      then = await givenWhenThen(caseId)
    })

    it('should create a court session', () => {
      expect(mockCourtSessionRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { transaction },
      )
      expect(then.result).toBe(createdCourtSession)
    })
  })

  describe('court session creation fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Faild to create court session')
    })
  })
})
