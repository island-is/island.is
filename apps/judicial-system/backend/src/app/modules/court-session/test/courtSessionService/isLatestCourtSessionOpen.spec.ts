import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  CourtSession,
  CourtSessionRepositoryService,
} from '../../../repository'
import { CourtSessionService } from '../../courtSession.service'

// The decision a merging case takes on its parent: whether the parent's latest
// court session is still open for it to join. Read in the caller's
// transaction, which holds the parent's row lock, rather than from the guard's
// earlier snapshot of the parent.
describe('CourtSessionService - Is latest court session open', () => {
  const caseId = uuid()
  const transaction = {} as Transaction

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let courtSessionService: CourtSessionService

  beforeEach(async () => {
    const { courtSessionRepositoryService, courtSessionService: service } =
      await createTestingCourtSessionModule()

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    courtSessionService = service
  })

  describe.each([
    ['is open', { id: uuid(), isConfirmed: false } as CourtSession, true],
    ['is confirmed', { id: uuid(), isConfirmed: true } as CourtSession, false],
    ['does not exist', null, false],
  ])('latest court session %s', (_name, latestCourtSession, expected) => {
    let result: boolean

    beforeEach(async () => {
      const mockFindLatestByCase =
        mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
      mockFindLatestByCase.mockResolvedValueOnce(latestCourtSession)

      result = await courtSessionService.isLatestCourtSessionOpen(
        caseId,
        transaction,
      )
    })

    it('should read the latest session in the transaction', () => {
      expect(
        mockCourtSessionRepositoryService.findLatestByCase,
      ).toHaveBeenCalledWith(caseId, { transaction })
    })

    it(`should answer ${expected}`, () => {
      expect(result).toBe(expected)
    })
  })

  describe('the read fails', () => {
    const error = new Error('Some error')
    let thrown: Error

    beforeEach(async () => {
      const mockFindLatestByCase =
        mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
      mockFindLatestByCase.mockRejectedValueOnce(error)

      try {
        await courtSessionService.isLatestCourtSessionOpen(caseId, transaction)
      } catch (e) {
        thrown = e as Error
      }
    })

    it('should let the error through', () => {
      expect(thrown).toBe(error)
    })
  })
})
