import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  CourtSession,
  CourtSessionRepositoryService,
} from '../../../repository'
import { UpdateCourtSessionDto } from '../../dto/updateCourtSession.dto'

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  courtSessionId: string,
  courtSessionToUpdate: UpdateCourtSessionDto,
) => Promise<Then>

describe('CourtSessionController - Update', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const location = 'Updated Location'
  const attendees = 'Updated Attendees'
  const courtSessionToUpdate = { location, attendees }

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let transaction: Transaction
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
    const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Failed to updaet court session'))

    givenWhenThen = async (
      caseId: string,
      courtSessionId: string,
      courtSessionToUpdate: UpdateCourtSessionDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          courtSessionToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court session updated', () => {
    const updatedCourtSession = {
      id: courtSessionId,
      caseId,
      location,
      attendees,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedCourtSession)

      then = await givenWhenThen(caseId, courtSessionId, courtSessionToUpdate)
    })

    it('should update the court session', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        courtSessionToUpdate,
        { transaction },
      )
      expect(then.result).toBe(updatedCourtSession)
    })
  })

  describe('court session update fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, courtSessionId, courtSessionToUpdate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to updaet court session')
    })
  })
})
